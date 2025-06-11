function gerarMapaAcessivel(tamanho, numServidores, numProblemas, minimoAcessiveis = 30) {
  function bfsAcessiveis(mapa) {
    const visitado = new Set();
    const fila = [[0, 0]];
    const acessiveis = [];

    while (fila.length > 0) {
      const [x, y] = fila.shift();
      const key = `${x},${y}`;
      if (visitado.has(key)) continue;
      visitado.add(key);
      acessiveis.push({ x, y });

      for (const [dx, dy] of [[1,0], [-1,0], [0,1], [0,-1]]) {
        const nx = x + dx, ny = y + dy;
        const nkey = `${nx},${ny}`;
        if (
          nx >= 0 && nx < tamanho &&
          ny >= 0 && ny < tamanho &&
          mapa[ny][nx] !== 'S' &&
          !visitado.has(nkey)
        ) {
          fila.push([nx, ny]);
        }
      }
    }

    return acessiveis;
  }

  function posicaoAleatoria(tamanho, ocupado) {
    let x, y;
    do {
      x = Math.floor(Math.random() * tamanho);
      y = Math.floor(Math.random() * tamanho);
    } while (ocupado.has(`${x},${y}`));
    ocupado.add(`${x},${y}`);
    return { x, y };
  }

  while (true) {
    const mapa = Array.from({ length: tamanho }, () => Array(tamanho).fill('C'));
    const ocupado = new Set(['0,0']);

    for (let i = 0; i < numServidores; i++) {
      const { x, y } = posicaoAleatoria(tamanho, ocupado);
      mapa[y][x] = 'S';
    }

    const acessiveis = bfsAcessiveis(mapa);
    if (acessiveis.length >= minimoAcessiveis) {
      const livres = acessiveis.filter(pos => !ocupado.has(`${pos.x},${pos.y}`));
      for (let i = 0; i < Math.min(numProblemas, livres.length); i++) {
        const { x, y } = livres[i];
        mapa[y][x] = 'P';
      }
      return mapa;
    }
  }
}


const grid = document.getElementById('grid');
const size = 20;
let playerX = 0;
let playerY = 0;
const cells = [];
let popupAberto = false;
let perguntaAtual = null;
let tempo = 0;
let intervaloTempo;
let perguntasRestantes;

const perguntas = [
  {
    problema: "Servidor desligado",
    pergunta: "Qual é o primeiro passo ao encontrar um servidor desligado?",
    opcoes: [
      { texto: "Chamar o gerente", correta: false },
      { texto: "Verificar se está ligado à corrente", correta: true },
      { texto: "Desinstalar o sistema operativo", correta: false }
    ]
  },
  {
    problema: "Rede lenta",
    pergunta: "O que pode causar lentidão na rede?",
    opcoes: [
      { texto: "Café derramado no teclado", correta: false },
      { texto: "Congestionamento de tráfego", correta: true },
      { texto: "Monitor desligado", correta: false }
    ]
  },
  {
    problema: "Disco cheio",
    pergunta: "Como resolver um disco cheio?",
    opcoes: [
      { texto: "Apagar ficheiros desnecessários", correta: true },
      { texto: "Desligar o servidor", correta: false },
      { texto: "Reiniciar o router", correta: false }
    ]
  },
  {
    problema: "Erro de autenticação",
    pergunta: "Qual é a causa comum de erro de autenticação?",
    opcoes: [
      { texto: "Palavra-passe errada", correta: true },
      { texto: "Falta de RAM", correta: false },
      { texto: "Problema com o monitor", correta: false }
    ]
  },
  {
    problema: "Falha de energia",
    pergunta: "O que fazer após uma falha de energia?",
    opcoes: [
      { texto: "Ignorar e continuar", correta: false },
      { texto: "Verificar os UPS", correta: true },
      { texto: "Fechar todas as janelas", correta: false }
    ]
  },
  {
    problema: "Latência elevada",
    pergunta: "Qual ferramenta ajuda a diagnosticar latência?",
    opcoes: [
      { texto: "Ping", correta: true },
      { texto: "Paint", correta: false },
      { texto: "Excel", correta: false }
    ]
  },
  {
    problema: "Temperatura elevada",
    pergunta: "Como baixar a temperatura de um servidor?",
    opcoes: [
      { texto: "Abrir a porta do datacenter", correta: false },
      { texto: "Melhorar a refrigeração", correta: true },
      { texto: "Mudar a cor do servidor", correta: false }
    ]
  },
  {
    problema: "Sistema não arranca",
    pergunta: "O que verificar primeiro quando o sistema não arranca?",
    opcoes: [
      { texto: "Cabo de alimentação", correta: true },
      { texto: "Velocidade da ventoinha", correta: false },
      { texto: "Cor da luz da sala", correta: false }
    ]
  },
  {
    problema: "Problema de backup",
    pergunta: "Qual é uma boa prática de backup?",
    opcoes: [
      { texto: "Fazer backups regulares", correta: true },
      { texto: "Ignorar backups", correta: false },
      { texto: "Usar pen USB de 1GB", correta: false }
    ]
  },
  {
    problema: "Atualizações pendentes",
    pergunta: "Porque é importante atualizar o sistema?",
    opcoes: [
      { texto: "Para adicionar jogos", correta: false },
      { texto: "Para segurança e estabilidade", correta: true },
      { texto: "Para mudar o wallpaper", correta: false }
    ]
  }
];

function gerarMapaAleatorio(tamanho, numServidores, numProblemas) {
  const mapa = Array.from({ length: tamanho }, () => Array(tamanho).fill('C'));
  const ocupado = new Set(['0,0']);

  function posicaoAleatoria() {
    let x, y;
    do {
      x = Math.floor(Math.random() * tamanho);
      y = Math.floor(Math.random() * tamanho);
    } while (ocupado.has(`${x},${y}`));
    ocupado.add(`${x},${y}`);
    return { x, y };
  }

  for (let i = 0; i < numServidores; i++) {
    const { x, y } = posicaoAleatoria();
    mapa[y][x] = 'S';
  }

  for (let i = 0; i < numProblemas; i++) {
    const { x, y } = posicaoAleatoria();
    mapa[y][x] = 'P';
  }

  return mapa;
}

const mapa = gerarMapaAleatorio(size, 100, perguntas.length);

function podeAndar(x, y) {
  return cells[y][x].classList.contains('corredor') || cells[y][x].classList.contains('problema');
}

const posicoesProblemas = [];

for (let y = 0; y < mapa.length; y++) {
  cells[y] = [];
  for (let x = 0; x < mapa[y].length; x++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    const tipo = mapa[y][x];

    if (tipo === 'P') posicoesProblemas.push({ x, y });

    switch (tipo) {
      case 'C': cell.classList.add('corredor'); break;
      case 'S': cell.classList.add('servidor'); break;
    }

    cell.dataset.x = x;
    cell.dataset.y = y;
    cell.addEventListener('click', () => movePlayerToClick(x, y));
    grid.appendChild(cell);
    cells[y][x] = cell;
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

shuffle(posicoesProblemas);

const problemasComPergunta = posicoesProblemas.slice(0, perguntas.length);
const restantes = posicoesProblemas.slice(perguntas.length);

problemasComPergunta.forEach(({ x, y }) => {
  cells[y][x].classList.add('problema');
});

restantes.forEach(({ x, y }) => {
  cells[y][x].classList.add('corredor');
});

function iniciarJogo() {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('grid').style.display = 'grid';
  document.getElementById('timer').style.display = 'block';
  perguntasRestantes = [...Array(perguntas.length).keys()];
  tempo = 0;
  renderPlayer();
  intervaloTempo = setInterval(() => {
    if (!popupAberto) {
      tempo++;
      document.getElementById('timer').textContent = `Tempo: ${tempo}s`;
    }
  }, 1000);
}

function reiniciarJogo() {
  location.reload();
}

function voltarAoMenu() {
  location.reload();
}

function renderPlayer() {
  document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('player'));
  cells[playerY][playerX].classList.add('player');
}

function movePlayerToClick(x, y) {
  if (popupAberto) return;
  const dx = Math.abs(x - playerX);
  const dy = Math.abs(y - playerY);
  if ((dx === 1 && dy === 0) || (dy === 1 && dx === 0)) {
    if (podeAndar(x, y)) {
      playerX = x;
      playerY = y;
      renderPlayer();
      checkForProblem();
    }
  }
}

function movePlayerByKey(dx, dy) {
  if (popupAberto) return;
  const newX = playerX + dx;
  const newY = playerY + dy;
  if (newX >= 0 && newX < size && newY >= 0 && newY < size && podeAndar(newX, newY)) {
    playerX = newX;
    playerY = newY;
    renderPlayer();
    checkForProblem();
  }
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp': movePlayerByKey(0, -1); break;
    case 'ArrowDown': movePlayerByKey(0, 1); break;
    case 'ArrowLeft': movePlayerByKey(-1, 0); break;
    case 'ArrowRight': movePlayerByKey(1, 0); break;
  }
});

function checkForProblem() {
  const cell = cells[playerY][playerX];
  if (cell.classList.contains('problema') && !popupAberto) {
    mostrarPergunta();
  }
}

function mostrarPergunta() {
  popupAberto = true;
  const randIndex = Math.floor(Math.random() * perguntasRestantes.length);
  const perguntaIndex = perguntasRestantes[randIndex];
  perguntasRestantes.splice(randIndex, 1);
  perguntaAtual = perguntas[perguntaIndex];

  document.getElementById('pergunta-problema').innerHTML = `<strong>Problema:</strong> ${perguntaAtual.problema}`;
  document.getElementById('pergunta-texto').innerHTML = `<strong>Pergunta:</strong> ${perguntaAtual.pergunta}`;

  const opcoesDiv = document.getElementById('opcoes');
  opcoesDiv.innerHTML = '';
  perguntaAtual.opcoes.forEach((opcao, index) => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="radio" name="quiz" value="${index}"> ${opcao.texto}`;
    opcoesDiv.appendChild(label);
  });

  document.getElementById('popup').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

function verificarResposta() {
  const resposta = document.querySelector('input[name="quiz"]:checked');
  const feedback = document.getElementById('feedback');

  if (!resposta) {
    feedback.textContent = 'Por favor, selecione uma opção.';
    return;
  }

  const selecionado = parseInt(resposta.value);
  if (perguntaAtual.opcoes[selecionado].correta) {
    feedback.textContent = 'Correto! Problema resolvido.';
    setTimeout(fecharPopup, 1500);
  } else {
    feedback.textContent = 'Incorreto. Tenta novamente.';
  }
}

function fecharPopup() {
  document.getElementById('popup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('feedback').textContent = '';
  document.querySelectorAll('input[name="quiz"]').forEach(el => el.checked = false);

  const cell = cells[playerY][playerX];
  cell.classList.remove('problema');
  cell.classList.add('corredor');

  popupAberto = false;

  const problemasRestantes = document.querySelectorAll('.problema');
  if (perguntasRestantes.length === 0 && problemasRestantes.length === 0) {
    clearInterval(intervaloTempo);
    document.getElementById('grid').style.display = 'none';
    document.getElementById('timer').style.display = 'none';
    document.getElementById('mensagem-final').textContent = `Completaste todos os problemas em ${tempo}s.`;
    document.getElementById('fim-jogo').style.display = 'block';
  }
}

window.onload = () => {
  document.getElementById('menu').style.display = 'block';
  document.getElementById('fim-jogo').style.display = 'none';
  document.getElementById('popup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('grid').style.display = 'none';
  document.getElementById('timer').style.display = 'none';
};
