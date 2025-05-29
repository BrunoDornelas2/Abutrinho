import { moedas, escolherExpressao } from './index.js';

function expressao9() {
  const container = document.querySelector(".game");
  container.innerHTML = "";

  const roleta = document.createElement("div");
  roleta.className = "roleta";

  const simbolos = ["V", "F"];
  const simboloAltura = 60;
  const visiveis = 3;
  let exist = false;
  
  //define o número de valores lógicos
  const colunas = [];
  const valoresCentrais = [null, null, null, null, null];
  const travadas = [false, false, false, false, false];
  const transformacoesFixas = [null, null, null, null, null];
  const valoresFixos = [null, null, null, null, null];

  for (let i = 0; i < 5; i++) {
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
    //local de escrita da expressão
    if (i == 0) {
      const sinal = document.createElement("div");
      sinal.className = "sinals";
      sinal.textContent = "(";
      roleta.appendChild(sinal);
    } else if (i == 1) {
      const sinal = document.createElement("div");
      sinal.className = "sinals";
      sinal.textContent = "→(";
      roleta.appendChild(sinal);
    } else if (i == 2) {
      const sinal = document.createElement("div");
      sinal.className = "sinals";
      sinal.textContent = "↑";
      roleta.appendChild(sinal);
    } else if (i == 3) {
      const sinal = document.createElement("div");
      sinal.className = "sinals";
      sinal.textContent = "))↓(";
      roleta.appendChild(sinal);
    } else if (i == 4) {
      const sinal = document.createElement("div");
      sinal.className = "sinals";
      sinal.textContent = "→";
      roleta.appendChild(sinal);
    }

    coluna.appendChild(rolo);
    roleta.appendChild(colunaWrapper);

    colunas.push({ rolo, indice: i });

    if (i == 4) {
      const sinal = document.createElement("div");
      sinal.className = "sinals";
      sinal.textContent = ")";
      roleta.appendChild(sinal);
    }
  }
  const box = document.createElement("div");
  box.className = "boxA";
  box.style.marginRight = "400px";
  box.style.width = "310px"
  box.id = "b1";
  roleta.appendChild(box);
  const boxx = document.createElement("div");
  boxx.className = "boxC";
  boxx.style.width = "900px"
  boxx.id = "b2";
  roleta.appendChild(boxx);
  const boxxx = document.createElement("div");
  boxxx.className = "boxB";
  boxxx.style.marginRight = "370px";
  boxxx.style.width = "528px"
  boxxx.id = "b3";
  roleta.appendChild(boxxx);
  const boxxxx = document.createElement("div");
  boxxxx.className = "boxA";
  boxxxx.style.width = "340px"
  boxxxx.id = "b4";
  roleta.appendChild(boxxxx);

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

  const somRoleta = new Audio("./audios/roleta.wav");

  botao.addEventListener("click", () => {
    botao.disabled = true;
    let colunasProcessadas = 0;

    somRoleta.currentTime = 0;
    somRoleta.play();

    const box1 = document.getElementById("b1");
    const box2 = document.getElementById("b2");
    const box3 = document.getElementById("b3");
    const box4 = document.getElementById("b4");

    if (box1) {
      box1.style.backgroundColor = "";
      box1.style.boxShadow = "";
    }
    if (box2) {
      box2.style.backgroundColor = "";
      box2.style.boxShadow = "";
    }
    if (box3) {
      box3.style.backgroundColor = "";
      box3.style.boxShadow = "";
    }
    if (box4) {
      box4.style.backgroundColor = "";
      box4.style.boxShadow = "";
    }

    colunas.forEach(({ rolo, indice }) => {
      if (travadas[indice]) {
        // Reaplica a transformação anterior
        if (transformacoesFixas[indice] !== null) {
          rolo.style.transform = transformacoesFixas[indice];
        }
        // Usa o valor fixado da rodada anterior
        valoresCentrais[indice] = valoresFixos[indice];
        colunasProcessadas++;
        if (colunasProcessadas === colunas.length) {
          somRoleta.pause();
          processarResultado();
        }
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
        valoresFixos[indice] = valor; // Atualiza valor fixo apenas se não travado

        colunasProcessadas++;
        if (colunasProcessadas === colunas.length) {
          somRoleta.pause();
          processarResultado();
        }
      }, 3000 + indice * 1000);
    });
  });

  function processarResultado() {
    const [v1, v2, v3, v4, v5] = valoresCentrais.map(v => v === "V");
    const resultado1 = !(v2 && v3);
    const resultado2 = !v1 || resultado1;
    const resultado3 = !v4 || v5;
    const resultadoFinal = !(resultado2 || resultado3);
    const imagemAbutre = document.getElementById("abutre");
    const imagemOriginalSrc = imagemAbutre.src;
    const imagemSorrindoSrc = "./imagens/maldito.png";
    const imagemIrritadoSrc = "./imagens/irritado.png";

    const box1 = document.getElementById("b1");
    const box2 = document.getElementById("b2");
    const box3 = document.getElementById("b3");
    const box4 = document.getElementById("b4");
    const colunasElement = document.querySelectorAll(".coluna-wrapper .coluna");

    if (box1) {
      box1.style.backgroundColor = resultado1 ? "limegreen" : "red";
      box1.style.boxShadow = resultado1 ? "0 0 10px 5px lime" : "0 0 10px 5px hotpink";
    }
    if (box2) {
      box2.style.backgroundColor = resultadoFinal ? "limegreen" : "red";
      box2.style.boxShadow = resultadoFinal ? "0 0 10px 5px lime" : "0 0 10px 5px hotpink";
    }
    if (box3) {
      box3.style.backgroundColor = resultado2 ? "limegreen" : "red";
      box3.style.boxShadow = resultado2 ? "0 0 10px 5px lime" : "0 0 10px 5px hotpink";
    }
    if (box4) {
      box4.style.backgroundColor = resultado3 ? "limegreen" : "red";
      box4.style.boxShadow = resultado3 ? "0 0 10px 5px lime" : "0 0 10px 5px hotpink";
    }

    if (!resultadoFinal) {
        const audioRisada1 = new Audio("./audios/risadas/risada1.flac");
        const audioRisada2 = new Audio("./audios/risadas/risada2.flac");
        const audioRisada3 = new Audio("./audios/risadas/risada3.flac");
        const audioRisada4 = new Audio("./audios/risadas/risada4.flac");
        const risadas = [audioRisada1, audioRisada2, audioRisada3, audioRisada4];
        let result = Math.floor(Math.random() * risadas.length);
        risadas[result].play();

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
      const moneyaudio = new Audio("./audios/money.wav");
      moneyaudio.play();
      const next = document.createElement("button");
      next.textContent = "PRÓXIMA";
      next.className = "btn-next";
      next.addEventListener("click", escolherExpressao);
      container.appendChild(next);
      exist = true;
      colunasElement.forEach(coluna => {
        coluna.classList.add("coluna-brilhante");
      });
      setTimeout(() => {
          imagemAbutre.src = imagemOriginalSrc;
          colunasElement.forEach(coluna => {
            coluna.classList.remove("coluna-brilhante");
          });
      }, 6000);
    }

    botao.disabled = false;
  }
}

export { expressao9 };