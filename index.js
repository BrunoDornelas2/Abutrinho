import { expressao1 } from './exp1.js';
import { expressao2 } from './exp2.js';
import { expressao3 } from './exp3.js';
import { expressao4 } from './exp4.js';

function moedas () {
    const moedasContainer = document.getElementById('moedas-container');

    const numMoedas = 250;

    for (let i = 0; i < numMoedas; i++) {

        const moeda = document.createElement('div');
        moeda.classList.add('moeda');

        moeda.style.left = `${Math.random() * 100}vw`;

        moeda.style.animationDelay = `${i * 0.02}s`;
        
        moedasContainer.appendChild(moeda);

        moeda.addEventListener('animationend', () => {
            moeda.remove();
        });
    }
};

export { moedas };

const expressoes = [expressao1, expressao2, expressao3, expressao4];
let usadas = [];

function escolherExpressao() {
  if (usadas.length === expressoes.length) {
    usadas = [];
  }

  let indice;
  do {
    indice = Math.floor(Math.random() * expressoes.length);
  } while (usadas.includes(indice));

  usadas.push(indice);
  expressoes[indice]();
}

window.addEventListener('load', escolherExpressao);

export {escolherExpressao};