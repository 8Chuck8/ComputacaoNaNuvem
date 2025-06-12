import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';


export default function Game({ user }) {
  const size = 20;
  const tileSize = 32;
  const [isMoving, setIsMoving] = useState(false);
  const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const navigate = useNavigate();


  const [mapa, setMapa] = useState([]);
  const [px, setPx] = useState(0);
  const [py, setPy] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answersByQ, setAnswersByQ] = useState({});
  const [indices, setIndices] = useState([]);
  const [qAtual, setQAtual] = useState(null);
  const [showQ, setShowQ] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intv, setIntv] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);

  const gerarMapa = (idxArr) => {
    const grid = Array.from({ length: size }, () => Array(size).fill('C'));
    const used = new Set(['0,0']);
    const rnd = () => {
      let x, y;
      do {
        x = Math.floor(Math.random() * size);
        y = Math.floor(Math.random() * size);
      } while (used.has(`${x},${y}`));
      used.add(`${x},${y}`);
      return { x, y };
    };
    for (let i = 0; i < 100; i++) {
      const { x, y } = rnd();
      grid[y][x] = 'S';
    }
    idxArr.forEach(() => {
      const { x, y } = rnd();
      grid[y][x] = 'P';
    });
    return grid;
  };

  const iniciar = async () => {
    try {
      const [qRes, aRes] = await Promise.all([
        fetch(`${API}/questions`),
        fetch(`${API}/answers`)
      ]);
      const qs = await qRes.json();
      const as = await aRes.json();
      const ativos = qs.data.filter(q => q.q_status === 1);
      setQuestions(ativos);

      const flat = as.data.map(a => {
        const idStr = typeof a.q_id === 'object' ? a.q_id._id : a.q_id;
        return { ...a, q_id: idStr.toString() };
      });

      const byQ = flat.reduce((acc, a) => {
        (acc[a.q_id] = acc[a.q_id] || []).push(a);
        return acc;
      }, {});
      setAnswersByQ(byQ);

      const idxs = ativos.map((_, i) => i);
      setIndices(idxs);
      setMapa(gerarMapa(idxs));
      setIsMoving(true);
      setPx(0); setPy(0);
      setScore(0); setTimer(0);
      setEnded(false);
      setStarted(true);
      const id = setInterval(() => setTimer(t => t + 1), 1000);
      setIntv(id);
    } catch (err) {
      alert('Error loading data.');
    }
  };

  useEffect(() => {
    const handler = e => {
      if (!started || showQ) return;
      let dx = 0, dy = 0;
      if (e.key === 'ArrowUp') dy = -1;
      if (e.key === 'ArrowDown') dy = 1;
      if (e.key === 'ArrowLeft') dx = -1;
      if (e.key === 'ArrowRight') dx = 1;
      const nx = px + dx, ny = py + dy;
      if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
        const tipo = mapa[ny][nx];
        if (tipo !== 'S') {
          setIsMoving(true);
          setPx(nx); setPy(ny);
          if (tipo === 'P') abrePergunta(nx, ny);
        }
      }
    };
    window.addEventListener('keydown', handler);
    if (isMoving || !started || showQ) return () => window.removeEventListener('keydown', handler);
  }, [px, py, mapa, showQ, started, indices]);

  const abrePergunta = (x, y) => {
    if (!started || showQ || !indices.length) return;
    const ridx = Math.floor(Math.random() * indices.length);
    const qIdx = indices[ridx];
    setIndices(curr => curr.filter((_, i) => i !== ridx));
    setQAtual(questions[qIdx]);
    setShowQ(true);
    setMapa(old => {
      const copy = old.map(row => [...row]);
      copy[y][x] = 'C';
      return copy;
    });
  };

  const verificar = async () => {
    const sel = document.querySelector('input[name="quiz"]:checked');
    if (!sel) return setFeedback('Choose an option');
    const idx = +sel.value;
    const opts = answersByQ[qAtual._id] || [];
    const chosen = opts[idx];
    const correct = chosen.a_correct === 1;
    setFeedback(correct ? '✔️ Correct!' : '❌ Incorrect...');
    if (correct) setScore(s => s + qAtual.q_score);

    setTimeout(async () => {
      setShowQ(false);
      setFeedback('');
      if (!indices.length) {
        clearInterval(intv);
        await fetch(`${API}/scores`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user._id,
            score: score + (correct ? qAtual.q_score : 0),
            time: timer
          })
        });
        setEnded(true);
      }
    }, 800);
  };

  if (!started || ended) {
    return (
      <div className="vh-100 d-flex bg-dark text-white align-items-center justify-content-center">
        <div className="card bg-secondary text-center p-4" style={{ maxWidth: 360 }}>
          <h4 className="mb-3">{!started ? 'Didactic Datacenter' : 'End of Game!'}</h4>
          <p className="mb-4">
            {!started ? 'Solve datacenter problems.' : `Got ${score} points in ${timer} seconds.`}
          </p>
          <button className={!started ? 'btn btn-primary' : 'btn btn-outline-light'} onClick={iniciar}>
            {!started ? 'Start Game' : 'Start over'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-dark min-vh-100 py-3 text-white">
      <div className="d-flex justify-content-between mx-3 mb-3">
        <span className="badge bg-primary">⏱ {timer}s</span>
        <span className="badge bg-info">💾 Score: {score}</span>
      </div>
      <div className="d-flex justify-content-center">
        <div style={{ position: 'relative' }}>
          <div className="d-grid" style={{
            gridTemplateColumns: `repeat(${size}, ${tileSize}px)`,
            gridTemplateRows: `repeat(${size}, ${tileSize}px)`,
            gap: '0px'
          }}>
            {mapa.map((row, y) => row.map((tipo, x) => (
              <div key={`${x}-${y}`} style={{ position: 'relative', width: tileSize, height: tileSize }}>
                <img src="/assets/tile.png" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
                {tipo === 'S' && <img src="/assets/server.png" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'contain', zIndex: 1 }} />}
                {tipo === 'P' && <img src="/assets/question.png" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'contain', zIndex: 1 }} />}
              </div>
            )))}</div>
          <div style={{
            position: 'absolute',
            top: py * tileSize,
            left: px * tileSize,
            width: tileSize,
            height: tileSize,
            transition: 'top 0.2s, left 0.2s',
            zIndex: 10
          }}>
            <img src="/assets/player.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>
      </div>



      {showQ && qAtual && (
        <>
          <div className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50" />
          <div className="modal show d-block" style={{ zIndex: 2000 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-dark text-white">
                <div className="modal-header border-0">
                  <h5 className="modal-title">{qAtual.q_question}</h5>
                  <button className="btn-close btn-close-white" onClick={() => setShowQ(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="list-group mb-3 text-start">
                    {(answersByQ[qAtual._id] || []).map((op, i) => (
                      <label key={i} className="list-group-item bg-secondary">
                        <input type="radio" name="quiz" value={i}
                          className="form-check-input me-2" />
                        {op.a_answer}
                      </label>
                    ))}
                  </div>
                  {feedback && <div className="text-warning mb-3">{feedback}</div>}
                </div>
                <div className="modal-footer border-0">
                  <button className="btn btn-success w-100" onClick={verificar}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}