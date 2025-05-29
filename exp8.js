import { moedas, escolherExpressao } from './index.js';

function expressao8() {
  const container = document.querySelector(".game");
  container.innerHTML = "";

  const roleta = document.createElement("div");
  roleta.className = "roleta";

  const simbolos = ["V", "F"];
  const simboloAltura = 60;
  const visiveis = 3;
  let exist = false;

  const colunas = [];
  const valoresCentrais = [null, null, null, null];
  const travadas = [false, false, false, false];
  const transformacoesFixas = [null, null, null, null];
  const valoresFixos = [null, null, null, null];

  for (let i = 0; i < 4; i++) {
    const colunaWrapper = document.createElement("div");
    colunaWrapper.className = "coluna-wrapper";

    const cadeado = document.createElement("div");
    cadeado.className = "cadeado";
    cadeado.innerHTML = "🔓";
    cadeado.style.display = "none";
    cadeado.dataset.index = i;

    cadeado.addEventListener("click", () => {
      const index = parseInt(cadeado.dataset.index);
      if (travadas[index]) {
        travadas[index] = false;
        cadeado.textContent = "🔓";
        cadeado.classList.remove("cadeado-travado");
      } else {
        travadas.fill(false);
        document.querySelectorAll(".cadeado").forEach((el) => {
            el.textContent = "🔓";
            el.classList.remove("cadeado-travado");
        });
        travadas[index] = true;
        cadeado.textContent = "🔒";
        cadeado.classList.add("cadeado-travado");
      }
    });

    colunaWrapper.appendChild(cadeado);
    const coluna = document.createElement("div");
    coluna.className = "coluna";
    colunaWrapper.appendChild(coluna);

    const rolo = document.createElement("div");
    rolo.className = "rolo";

    for (let j = 0; j < 80; j++) {
      const valor = simbolos[Math.floor(Math.random() * simbolos.length)];
      const simbolo = document.createElement("div");
      simbolo.className = "simbolo " + (valor === "V" ? "v" : "f");
      simbolo.textContent = valor;
      rolo.appendChild(simbolo);
    }

    if (i === 0) {
      const sinal = document.createElement("div");
      sinal.className = "sinals";
      sinal.textContent = "(";
      roleta.appendChild(sinal);
    } else if (i === 1) {
      const sinal = document.createElement("div");
      sinal.className = "sinals";
      sinal.textContent = "⊻";
      roleta.appendChild(sinal);
    } else if (i === 2) {
      const sinal = document.createElement("div");
      sinal.className = "sinals";
      sinal.textContent = ")∧¬(";
      roleta.appendChild(sinal);
    } else if (i === 3) {
      const sinal = document.createElement("div");
      sinal.className = "sinals";
      sinal.textContent = "∧";
      roleta.appendChild(sinal);
    }

    coluna.appendChild(rolo);
    roleta.appendChild(colunaWrapper);

    colunas.push({ rolo, indice: i });
  }

  const sinalFinal = document.createElement("div");
  sinalFinal.className = "sinals";
  sinalFinal.textContent = ")";
  roleta.appendChild(sinalFinal);

  const box1 = document.createElement("div");
  box1.className = "boxA";
  box1.style.width = "320px";
  box1.id = "b1";
  roleta.appendChild(box1);

  const box2 = document.createElement("div");
  box2.className = "boxB";
  box2.style.width = "480px";
  box2.id = "b2";
  roleta.appendChild(box2);

  container.appendChild(roleta);

  const imagem = document.createElement("img");
  imagem.src = "./imagens/padrao.png";
  imagem.className = "imagem";
  imagem.id = "abutre";
  container.appendChild(imagem);

  const botao = document.createElement("button");
  botao.textContent = "JOGAR";
  botao.className = "btn-jogar";
  container.appendChild(botao);

  botao.addEventListener("click", () => {
    botao.disabled = true;
    let colunasProcessadas = 0;

    [box1, box2].forEach(box => {
      if (box) {
        box.style.backgroundColor = "";
        box.style.boxShadow = "";
      }
    });

    colunas.forEach(({ rolo, indice }) => {
      if (travadas[indice]) {
        if (transformacoesFixas[indice] !== null) {
          rolo.style.transform = transformacoesFixas[indice];
        }
        valoresCentrais[indice] = valoresFixos[indice];
        colunasProcessadas++;
        if (colunasProcessadas === colunas.length) processarResultado();
        return;
      }

      const totalSimbolos = rolo.children.length;
      const maxIndex = totalSimbolos - visiveis;
      const indiceFinal = Math.floor(Math.random() * maxIndex);
      const deslocamento = indiceFinal * simboloAltura;

      const transform = `translateY(-${deslocamento}px)`;
      rolo.style.transition = `transform ${2 + indice}s ease-in-out`;
      rolo.style.transform = transform;

      transformacoesFixas[indice] = transform;

      setTimeout(() => {
        const primeiroVisivel = Math.floor(deslocamento / simboloAltura);
        const simboloCentral = rolo.children[primeiroVisivel + 1];
        const valor = simboloCentral.textContent;

        valoresCentrais[indice] = valor;
        valoresFixos[indice] = valor;

        colunasProcessadas++;
        if (colunasProcessadas === colunas.length) processarResultado();
      }, 3000 + indice * 1000);
    });
  });

  function processarResultado() {
    const [A, B, C, D] = valoresCentrais.map(v => v === "V");
    const xor = (A && !B) || (!A && B);
    const e = C && D;
    const negacao = !e;
    const resultadoFinal = xor && negacao;
    
    const imagemAbutre = document.getElementById("abutre");
    const imagemOriginalSrc = imagemAbutre.src;
    const imagemSorrindoSrc = "./imagens/maldito.png";
    const imagemIrritadoSrc = "./imagens/irritado.png";

    if (box1) {
      box1.style.backgroundColor = xor ? "limegreen" : "red";
      box1.style.boxShadow = xor ? "0 0 10px 5px lime" : "0 0 10px 5px hotpink";
    }

    if (box2) {
      box2.style.backgroundColor = negacao ? "limegreen" : "red";
      box2.style.boxShadow = negacao ? "0 0 10px 5px lime" : "0 0 10px 5px hotpink";
    }

if (!resultadoFinal) {
      const risadas = [
        new Audio("./audios/risadas/risada1.flac"),
        new Audio("./audios/risadas/risada2.flac"),
        new Audio("./audios/risadas/risada3.flac"),
        new Audio("./audios/risadas/risada4.flac")
      ];
      risadas[Math.floor(Math.random() * risadas.length)].play();

      document.querySelectorAll(".cadeado").forEach(cadeado => {
        cadeado.style.display = "block";
      });

      setTimeout(() => {
        imagemAbutre.src = imagemSorrindoSrc;
      }, 500);
      
      setTimeout(() => {
        imagemAbutre.src = imagemOriginalSrc;
      }, 3000);
    }

    if (resultadoFinal && !exist) {
      moedas();
      imagemAbutre.src = imagemIrritadoSrc;
      new Audio("./audios/money.wav").play();
      
      const next = document.createElement("button");
      next.textContent = "PRÓXIMA";
      next.className = "btn-next";
      next.addEventListener("click", escolherExpressao);
      container.appendChild(next);
      
      exist = true;
      document.querySelectorAll(".coluna-wrapper .coluna").forEach(coluna => {
        coluna.classList.add("coluna-brilhante");
      });
      
      setTimeout(() => {
        imagemAbutre.src = imagemOriginalSrc;
        document.querySelectorAll(".coluna-wrapper .coluna").forEach(coluna => {
          coluna.classList.remove("coluna-brilhante");
        });
      }, 6000);
    }

    botao.disabled = false;
  }
}

export { expressao8 };