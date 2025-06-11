import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Game({ user }) {
  const size = 20;
  const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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

  // Gera o mapa 20x20
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

  // Inicia o jogo: fetch questions e answers
  const iniciar = async () => {
    try {
      const [qRes, aRes] = await Promise.all([
        fetch(`${API}/questions`),
        fetch(`${API}/answers`)
      ]);
      if (!qRes.ok || !aRes.ok) throw new Error('HTTP Error');
      const qBody = await qRes.json();
      const aBody = await aRes.json();
      const qs = Array.isArray(qBody.data) ? qBody.data : qBody;
      const ans = Array.isArray(aBody.data) ? aBody.data : aBody;

      // perguntas ativas
      const ativos = qs.filter(q => q.q_status === 1);
      setQuestions(ativos);

      // normaliza q_id de cada resposta para string
      const flat = ans.map(a => {
        const raw = a.q_id;
        const idStr = typeof raw === 'object' && raw !== null
          ? raw._id || raw.q_id
          : raw;
        return {
          ...a,
          q_id: idStr.toString()
        };
      });
      // agrupa por q_id
      const byQ = flat.reduce((acc, a) => {
        (acc[a.q_id] = acc[a.q_id] || []).push(a);
        return acc;
      }, {});
      setAnswersByQ(byQ);

      // índices e mapa
      const idxs = ativos.map((_, i) => i);
      setIndices(idxs);
      setMapa(gerarMapa(idxs));

      // reseta estados
      setPx(0); setPy(0);
      setScore(0);
      setTimer(0);
      setEnded(false);
      setStarted(true);
      const id = setInterval(() => setTimer(t => t + 1), 1000);
      setIntv(id);
    } catch (err) {
      console.error(err);
      alert('Falha ao carregar dados. Veja o console.');
    }
  };

  // Movimento do jogador
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
          setPx(nx); setPy(ny);
          if (tipo === 'P') abrePergunta(nx, ny);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [px, py, mapa, showQ, started, indices]);

  // Abre o modal de pergunta
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

  // Verifica a resposta e grava em answers e scores
  const verificar = async () => {
    const sel = document.querySelector('input[name="quiz"]:checked');
    if (!sel) {
      setFeedback('Escolha uma opção');
      return;
    }
    const idx = +sel.value;
    const opts = answersByQ[qAtual._id] || [];
    const chosen = opts[idx];
    const correct = chosen.a_correct === 1;
    setFeedback(correct ? '✔️ Correto!' : '❌ Incorreto...');
    if (correct) setScore(s => s + qAtual.q_score);

    // grava resposta do quiz
    await fetch(`${API}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q_id:      qAtual.q_id,
        a_answer:  chosen.a_answer,
        a_correct: chosen.a_correct
      })
    });

    setTimeout(async () => {
      setShowQ(false);
      setFeedback('');
      if (!indices.length) {
        clearInterval(intv);
        // grava score final
        await fetch(`${API}/scores`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            u_id:    user.u_id,
            s_name:  user.u_name,
            s_score: score + (correct ? qAtual.q_score : 0),
            s_time:  timer
          })
        });
        setEnded(true);
      }
    }, 800);
  };

  // Menu inicial / fim de jogo
  if (!started || ended) {
    const title = !started ? 'Datacenter Didático' : 'Fim de Jogo!';
    const text = !started
      ? 'Bem-vindo! Resolva os problemas do datacenter.'
      : `Acertou ${score} pontos em ${timer}s.`;
    const btnTxt = !started ? 'Iniciar Jogo' : 'Recomeçar';
    const btnCls = !started ? 'btn btn-primary' : 'btn btn-outline-light';

    return (
      <div className="vh-100 d-flex bg-dark text-white align-items-center justify-content-center">
        <div className="card bg-secondary bg-opacity-75 text-center p-4" style={{ maxWidth: 360 }}>
          <h4 className="mb-3">{title}</h4>
          <p className="mb-4">{text}</p>
          <button className={btnCls} onClick={iniciar}>{btnTxt}</button>
        </div>
      </div>
    );
  }

  // Jogo em execução
  return (
    <div className="container-fluid bg-dark min-vh-100 py-3 text-white">
      {/* Temporizador */}
      <div className="d-flex justify-content-end mb-2 me-3">
        <span className="badge bg-secondary">⏱ {timer}s</span>
      </div>

      {/* Tabuleiro */}
      <div className="d-flex justify-content-center mb-3">
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, 20px)`,
          gridTemplateRows:    `repeat(${size}, 20px)`,
          gap: '2px'
        }}>
          {mapa.map((row, y) => row.map((tipo, x) => (
            <div key={`${x}-${y}`} style={{
              width: 20,
              height: 20,
              backgroundColor:
                x === px && y === py ? '#0d6efd' :
                tipo === 'S'         ? '#1f2124' :
                tipo === 'P'         ? '#ffc107' :
                                       '#343a40'
            }}/>
          )))}
        </div>
      </div>

      {/* Modal de Pergunta */}
      {showQ && qAtual && (
        <>
          <div className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50"/>
          <div className="modal show d-block" style={{ zIndex: 2000 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-secondary bg-opacity-75 text-white">
                <div className="modal-header border-0">
                  <h5 className="modal-title">{qAtual.q_question}</h5>
                  <button className="btn-close btn-close-white" onClick={()=>setShowQ(false)}/>
                </div>
                <div className="modal-body">
                  <div className="list-group mb-3 text-start">
                    {(answersByQ[qAtual._id]||[]).map((op, i) => (
                      <label key={i} className="list-group-item bg-dark text-white">
                        <input type="radio" name="quiz" value={i}
                               className="form-check-input me-2"/>
                        {op.a_answer}
                      </label>
                    ))}
                  </div>
                  {feedback && <div className="text-warning mb-3">{feedback}</div>}
                </div>
                <div className="modal-footer border-0">
                  <button className="btn btn-primary w-100" onClick={verificar}>
                    Submeter
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
