let nome = "";
let nomeDefinido = false;

const perguntas = [
    { pergunta: "Qual é a Capital de Angola?", opcoes: ["Luanda", "Benguela", "Huambo", "Lobito"], correta: 0 },
    { pergunta: "Quanto é 2+2?", opcoes: ["3", "4", "6", "0"], correta: 1 },
        { pergunta: "Quanto é 2+3?", opcoes: ["3", "4", "5", "0"], correta:2 },
                { pergunta: "Quanto é 3+3?", opcoes: ["3", "4", "6", "0"], correta:2 }
];
const TOTAL_PERGUNTAS= 2

const somAcerto = new Audio("acerto.mp3");
const somErro = new Audio("erro.mp3");
const musicaFundo = new Audio("musica/fundo.mp3");
musicaFundo.addEventListener("timeupdate", () => {
    if (musicaFundo.currentTime >= 31) {
        musicaFundo.currentTime = 0; // volta pro início
        musicaFundo.play();
    }
});


musicaFundo.loop = true;
musicaFundo.volume = 0.3;
let perguntasSelecionadas = [...perguntas]
    .sort(() => Math.random() - 0.5)
    .slice(0, TOTAL_PERGUNTAS);

let atual = 0;
let pontuacao = 0;
let tempo = 30;
let intervalo;
let pausado = false;

// 🎯 ATUALIZA ESTRELA
function atualizarEstrela(acertou = true) {
    const estrela = document.getElementById("pontuacao");

    estrela.innerText = "⭐ " + pontuacao;

    // remove animações antigas
    estrela.classList.remove("ponto-animado", "ponto-erro");

    // força reiniciar animação
    void estrela.offsetWidth;

    if (acertou) {
        estrela.classList.add("ponto-animado"); // cresce
    } else {
        estrela.classList.add("ponto-erro"); // treme
    }
    
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

    salvarHistorico(); // 🔥 salva aqui

    document.getElementById("overlayFinal").style.display = "flex";

document.getElementById("pontuacaoFinal").innerText ="Parabéns " + nome + ",\n  ganhaste ⭐ " + pontuacao + " / " + perguntasSelecionadas.length;

}

// 🔄 REINICIAR
function iniciarJogo() {
    let nomeSalvo = localStorage.getItem("nomeJogador");

    // 🔥 Se já existe nome guardado, usa direto
    if (nomeSalvo) {
        nome = nomeSalvo;
    } else {
        nome = document.getElementById("nomeJogador").value;

        if (nome.trim() === "") {
            alert("Digite seu nome!");
            return;
        }

        // 🔥 Salva o nome só uma vez
        localStorage.setItem("nomeJogador", nome);
    }

    document.getElementById("telaInicial").style.display = "none";
    document.getElementById("quiz").style.display = "flex";

    carregarPergunta();
}



// ⏸️ PAUSE
function pausarJogo() {
    const btn = document.getElementById("btnPause");

    pausado = !pausado;

    if (pausado) {
        musicaFundo.pause();
        btn.innerText = "▶️";
    } else {
        musicaFundo.play();
        btn.innerText = "⏸";
    }
}


function mostrarSobre() {
    document.getElementById("sobreBox").style.display = "block";
}

function fecharSobre() {
    document.getElementById("sobreBox").style.display = "none";
}

function salvarHistorico() {
    let historico = JSON.parse(localStorage.getItem("historico")) || [];

    historico.push({
        nome: nome,
        pontos: pontuacao,
        total: perguntasSelecionadas.length,
        data: new Date().toLocaleString()
    });

    localStorage.setItem("historico", JSON.stringify(historico));
}

function verHistorico() {
    let historico = JSON.parse(localStorage.getItem("historico")) || [];

    let box = document.getElementById("historicoBox");
    box.style.display = "block";

    if (historico.length === 0) {
        box.innerHTML = "Sem histórico ainda.";
        return;
    }

    box.innerHTML = "<h3>Histórico</h3>";

    historico.reverse().forEach(item => {
        box.innerHTML += `
            <p>
                🎉 Parabéns  ${item.nome} - ⭐ ${item.pontos}/${item.total} <br>
                🕒 ${item.data}
            </p>
        `;
    });
}
function reiniciarJogo() {
    pontuacao = 0;
    atual = 0;
    tempo = 30;

perguntasSelecionadas = [...perguntas]
    .sort(() => Math.random() - 0.5)
    .slice(0, TOTAL_PERGUNTAS);

    // 🔥 ESCONDE TELA FINAL
    document.getElementById("overlayFinal").style.display = "none";

    // 🔥 MOSTRA O QUIZ DE NOVO
    document.getElementById("quiz").style.display = "flex";

    atualizarEstrela(true);// ou false, só pra n~~ao quebrar

    carregarPergunta(); // 🔥 reinicia o jogo
}
function verHistorico() {
    let historico = JSON.parse(localStorage.getItem("historico")) || [];

    let box = document.getElementById("historicoBox");
    let conteudo = document.getElementById("historicoConteudo");

    box.style.display = "flex";

    if (historico.length === 0) {
        conteudo.innerHTML = "Sem histórico ainda.";
        return;
    }

    conteudo.innerHTML = "";

    historico.slice().reverse().forEach(item => {
        conteudo.innerHTML += `
            <div style="background:white; color:black; padding:10px; margin:10px 0; border-radius:10px;">
                🎉 ${item.nome}<br>
                ⭐ ${item.pontos}/${item.total}<br>
                🕒 ${item.data}
            </div>
        `;
    });
}
function fecharHistorico() {
    document.getElementById("historicoBox").style.display = "none";
}
window.onload = function () {
    let nomeSalvo = localStorage.getItem("nomeJogador");

    if (nomeSalvo) {
        // 🔥 Esconde o input e botão
        document.getElementById("nomeJogador").style.display = "none";
        document.getElementById("btnIniciar").innerText = "Jogar novamente";
    }
};
function trocarNome() {
    localStorage.removeItem("nomeJogador");
    location.reload();
}

