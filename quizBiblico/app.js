const perguntas = [
    { pergunta: "Qual é a Capital de Angola?", opcoes: ["Luanda", "Benguela", "Huambo", "Lobito"], correta: 0 },
    { pergunta: "Quanto é 2+2?", opcoes: ["3", "4", "6", "0"], correta: 1 }
];

const somAcerto = new Audio("acerto.mp3");
const somErro = new Audio("erro.mp3");
const musicaFundo = new Audio("fundo.mp3");

musicaFundo.loop = true;
musicaFundo.volume = 0.3;

let perguntasSelecionadas = perguntas.sort(() => Math.random() - 0.5);
let atual = 0;
let pontuacao = 0;
let tempo = 30;
let intervalo;
let pausado = false;

// 🎯 ATUALIZA ESTRELA
function atualizarEstrela() {
    document.getElementById("pontuacao").innerText = "⭐ " + pontuacao;
}

// 📌 CARREGAR PERGUNTA
function carregarPergunta() {
    if (atual >= perguntasSelecionadas.length) {
        finalizarJogo();
        return;
    }

    const p = perguntasSelecionadas[atual];

    document.getElementById("pergunta").innerText = p.pergunta;

    p.opcoes.forEach((op, i) => {
        document.getElementById("op" + i).innerText = op;
    });

    document.getElementById("resultado").innerText = "";

    tempo = 30;
    document.getElementById("tempo").innerText = "⏱️ " + tempo;

    document.getElementById("progressoTempo").style.width = "100%";
    document.getElementById("progressoTempo").style.background = "lime";

    document.body.addEventListener("click", () => {
        musicaFundo.play();
    }, { once: true });

    clearInterval(intervalo);
    iniciarTempo();
}

// ⏱️ TEMPO
function iniciarTempo() {
    intervalo = setInterval(() => {
        if (pausado) return;

        tempo--;

        document.getElementById("tempo").innerText = "⏱️ " + tempo;

        let porcentagem = (tempo / 30) * 100;
        document.getElementById("progressoTempo").style.width = porcentagem + "%";

        if (tempo <= 10) {
            document.getElementById("progressoTempo").style.background = "red";
        }

        if (tempo <= 0) {
            clearInterval(intervalo);
            atualizarPontuacao(false);
        }
    }, 1000);
}

// 🎮 RESPONDER
function responder(opcao) {
    const correta = perguntasSelecionadas[atual].correta;

    for (let i = 0; i < 4; i++) {
        document.getElementById("op" + i).disabled = true;
    }

    for (let i = 0; i < 4; i++) {
        const btn = document.getElementById("op" + i);

        if (i === correta) {
            btn.classList.add("correto");
        } else if (i === opcao) {
            btn.classList.add("errado");
        }
    }

    const acertou = opcao === correta;

    setTimeout(() => {
        for (let i = 0; i < 4; i++) {
            const btn = document.getElementById("op" + i);

            btn.classList.remove("correto");
            btn.classList.remove("errado");
            btn.disabled = false;
        }

        atualizarPontuacao(acertou);

    }, 600);
}

// ⭐ PONTUAÇÃO
function atualizarPontuacao(acertou) {

    if (acertou) {
        pontuacao++; // 🔥 AQUI RESOLVE TUDO
        atualizarEstrela();

        somAcerto.currentTime = 0;
        somAcerto.play();

        setTimeout(() => {
            somAcerto.pause();
            somAcerto.currentTime = 0;
        }, 3000);

    } else {
        somErro.currentTime = 0;
        somErro.play();

        setTimeout(() => {
            somErro.pause();
            somErro.currentTime = 0;
        }, 3000);
    }

    atual++;
    clearInterval(intervalo);

    setTimeout(() => {
        if (atual < perguntasSelecionadas.length) {
            carregarPergunta();
        } else {
            finalizarJogo();
        }
    }, 1000);
}

// 🏁 FINAL
function finalizarJogo() {
    clearInterval(intervalo);

    document.getElementById("overlayFinal").style.display = "flex";

    document.getElementById("pontuacaoFinal").innerText =
        "⭐ " + pontuacao + " / " + perguntasSelecionadas.length;
}

// 🔄 REINICIAR
function reiniciarJogo() {
    pontuacao = 0;
    atual = 0;
    tempo = 30;

    perguntasSelecionadas = perguntas.sort(() => Math.random() - 0.5);

    document.getElementById("overlayFinal").style.display = "none";

    atualizarEstrela();
    carregarPergunta();
}

// ⏸️ PAUSE
function pausarJogo() {
    pausado = !pausado;
}

// 🚀 INICIAR
carregarPergunta();
