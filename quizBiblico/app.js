import { getDocs, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
let jogoFinalizado = false;

let nivel = "facil";
let vidas = 3;
let nome = "";
let nomeDefinido = false;

const perguntas = [
    { pergunta: "Qual é a Capital de Angola?", opcoes: ["Luanda", "Benguela", "Huambo", "Lobito"], correta: 0 },
    { pergunta: "Quanto é 2+2?", opcoes: ["3", "4", "6", "0"], correta: 1 },
        { pergunta: "Quanto é 2+3?", opcoes: ["3", "4", "5", "0"], correta:2 },
                { pergunta: "Quanto é 3+3?", opcoes: ["3", "4", "6", "0"], correta:2 }
];
const TOTAL_PERGUNTAS= 4
const somClick = new Audio("musica/toc.mp3");
const somTempo = new Audio("musica/tempo.mp3");
somTempo.loop = true; // 🔁 fica repetindo
const somVitoria = new Audio("musica/victoria.mp3");
const somDerrota = new Audio("musica/lose.mp3");
const somAcerto = new Audio("musica/acerto.mp3");
const somErro = new Audio("musica/errado.mp3");
const musicaFundo = new Audio("musica/fundo.mp3");
musicaFundo.addEventListener("timeupdate", () => {
    if (musicaFundo.currentTime >= 31) {
        musicaFundo.currentTime = 0; // volta pro início
        musicaFundo.play();
    }
});


musicaFundo.loop = true;
musicaFundo.volume = 0.2;
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
        // 🔇 PARA QUALQUER SOM ANTES
    somTempo.pause();
    somTempo.currentTime = 0;

    // 🔊 COMEÇA NOVO SOM
    somTempo.play();

    if (nivel === "facil") tempo = 30;
    if (nivel === "medio") tempo = 20;
    if (nivel === "dificil") tempo = 10;


    const p = perguntasSelecionadas[atual];

    document.getElementById("pergunta").innerText = p.pergunta;

    p.opcoes.forEach((op, i) => {
        document.getElementById("op" + i).innerText = op;
    });

    document.getElementById("resultado").innerText = "";
    //define tempo baseado no nível
    if (nivel === "facil") tempo = 30;
    if (nivel === "medio") tempo = 20;
    if (nivel === "dificil") tempo = 10;
    //atualiza na tela
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
                somTempo.playbackRate = 1.5; // mais rápido 😱
        }

        if (tempo <= 0) {
            clearInterval(intervalo);

            // 🔇 PARA SOM DO TEMPO
            somTempo.pause();
            somTempo.currentTime = 0;

            vidas--; // 🔥 perde vida
            document.getElementById("vidas").innerText = "❤️ " + vidas;

            if (vidas <= 0) {
                finalizarJogo(); // só termina se acabar vidas
                return;
            }

            atual++; // 🔥 vai pra próxima pergunta

            setTimeout(() => {
                carregarPergunta();
            }, 500);
        }

    }, 1000);
}

// 🎮 RESPONDER
function responder(opcao) {
    if(pausado)return;
    const correta = perguntasSelecionadas[atual].correta;

    somTempo.pause();
    somTempo.currentTime = 0;

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
    if (!acertou) {
    vidas--;

    document.getElementById("vidas").innerText = "❤️ " + vidas;

    if (vidas <= 0) {
        finalizarJogo();
        return;
    }
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
async function finalizarJogo() {
    if (jogoFinalizado) return;
    jogoFinalizado = true;

    clearInterval(intervalo);

    musicaFundo.pause();
    musicaFundo.currentTime = 0;

    somTempo.pause();
    somTempo.currentTime = 0;

    // 🔥 MOSTRA RESULTADO IMEDIATO (SEM FIREBASE)
    const overlay = document.getElementById("overlayFinal");
    overlay.style.display = "flex";

    document.getElementById("pontuacaoFinal").innerText =
        "Parabéns " + nome +
        "\n⭐ Pontos: " + pontuacao +
        "\n🏆 Posição Global: carregando...";

    // 🔥 FIREBASE RODA DEPOIS (SEM TRAVAR O JOGO)
    try {
        if (window.db) {
            await salvarRankingOnline();
            let posicao = await obterPosicaoOnline();

            document.getElementById("pontuacaoFinal").innerText =
                "Parabéns " + nome +
                "\n⭐ Pontos: " + pontuacao +
                "\n🏆 Posição Global: #" + posicao;
        }
    } catch (e) {
        console.log("Erro no ranking:", e);

        document.getElementById("pontuacaoFinal").innerText =
            "Parabéns " + nome +
            "\n⭐ Pontos: " + pontuacao +
            "\n⚠️ Ranking indisponível";
    }
}

// 🔥 COLOCA AQUI
async function obterPosicaoOnline() {
    if (!window.db) return "-"; // 🔥 evita travar

    const querySnapshot = await getDocs(collection(window.db, "ranking"));

    let lista = [];

    querySnapshot.forEach((doc) => {
        lista.push(doc.data());
    });

    lista.sort((a, b) => b.pontos - a.pontos);

    let posicao = lista.findIndex(item => item.nome === nome);

    return posicao !== -1 ? posicao + 1 : "-";
}

// 🔄 REINICIAR
function iniciarJogo() {
            // 🔊 toca som de clique
    somClick.currentTime = 0;
    somClick.play();

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
function pausarJogo() {    const btn = document.getElementById("btnPause");

    pausado = !pausado;

    if (pausado) {
        musicaFundo.pause();
        somTempo.pause();
        btn.innerText = "▶️";
           // 🔒 BLOQUEIA BOTÕES
        for (let i = 0; i < 4; i++) {
            document.getElementById("op" + i).disabled = true;
        }
     
    } else {
        musicaFundo.play();
        somTempo.play();
        btn.innerText = "⏸";
                // 🔓 LIBERA BOTÕES
        for (let i = 0; i < 4; i++) {
            document.getElementById("op" + i).disabled = false;
        }
    }
}

function salvarHistorico() {
    let historico = JSON.parse(localStorage.getItem("historico")) || [];

    historico.push({
        nome: nome,
        pontos: pontuacao
    });

    // 🔥 ordena do maior para o menor
    historico.sort((a, b) => b.pontos - a.pontos);

    // 🔥 mantém só os 5 melhores
    historico = historico.slice(0, 5);

    localStorage.setItem("historico", JSON.stringify(historico));
}


function verHistorico() {
    let historico = JSON.parse(localStorage.getItem("historico")) || [];

    let box = document.getElementById("historicoBox");
    let conteudo = document.getElementById("historicoConteudo");

    box.style.display = "flex";

    if (historico.length === 0) {
        conteudo.innerHTML = "Sem ranking ainda.";
        return;
    }

    conteudo.innerHTML = "<h3>🏆 TOP 5</h3>";

    let medalhas = ["🥇", "🥈", "🥉", "🏅", "🏅"];

    historico.forEach((item, i) => {
        conteudo.innerHTML += `
            <div>
                ${medalhas[i]} ${item.nome} ⭐ ${item.pontos}
            </div>
        `;
    });
}
function reiniciarJogo() {
    pontuacao = 0;
    atual = 0;
    tempo = 30;
    vidas = 3;

    document.getElementById("vidas").innerText = "❤️ " + vidas; // 🔥 FALTAVA ISSO

    perguntasSelecionadas = [...perguntas]
        .sort(() => Math.random() - 0.5)
        .slice(0, TOTAL_PERGUNTAS);

    document.getElementById("overlayFinal").style.display = "none";
    document.getElementById("quiz").style.display = "flex";

    atualizarEstrela(true);
    jogoFinalizado = false;


    carregarPergunta();
}

function fecharHistorico() {
    document.getElementById("historicoBox").style.display = "none";
}

// 🔥 COLOCA AQUI
async function salvarRankingOnline() {
    if (!window.db) return; // 🔥 evita travar

    await addDoc(collection(window.db, "ranking"), {
        nome: nome,
        pontos: pontuacao
    });
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
function sairJogo() {
    // Esconde o quiz
    document.getElementById("quiz").style.display = "none";

    // Mostra a tela inicial
    document.getElementById("telaInicial").style.display = "flex";

    // Para a música
    musicaFundo.pause();
    musicaFundo.currentTime = 0;

    // Reset básico
    pontuacao = 0;
    atual = 0;
    vidas= 3;
}
let somAtivo = true;

function abrirConfiguracoes() {
    document.getElementById("menuConfig").style.display = "flex";
}

function fecharConfig() {
    document.getElementById("menuConfig").style.display = "none";
}

function toggleSom() {
    somAtivo = !somAtivo;

    if (somAtivo) {
        musicaFundo.volume = 0.3;
        alert("🔊 Som ativado");
    } else {
        musicaFundo.volume = 0;
        alert("🔇 Som desligado");
    }
}
// 🎵 VOLUME
function mudarVolume(valor) {
    musicaFundo.volume = valor;
}

// 🌙 MODO ESCURO
let modoEscuro = false;

function toggleModoEscuro() {
    modoEscuro = !modoEscuro;
    localStorage.setItem("modoEscuro", modoEscuro);


    if (modoEscuro) {
        document.body.classList.add("dark-mode");
        alert("Modo escuro Ativo.")
    } else {
        document.body.classList.remove("dark-mode");
        alert("Modo escuro Desativado.")
    }
    if (localStorage.getItem("modoEscuro") === "true") {
    document.body.classList.add("dark-mode");
    }

}

// 🔄 RESETAR PROGRESSO
function resetarProgresso() {
    localStorage.clear();
    alert("Progresso apagado!");
}


function abrirNivel() {
    document.getElementById("menuNivel").style.display = "flex";
    
}

function escolherNivel(n) {
        // 🔊 toca som de clique
    somClick.currentTime = 0;
    somClick.play();
    nivel = n;

    document.getElementById("menuNivel").style.display = "none";

    iniciarJogo(); // 🔥 só começa depois de escolher
}
function saberMais(){
    alert("O jogo surgiu por causa do estudo de Obreiros Aprovados, na qual aprendemos muito sobre a vida de Jesus então decidi transformar isso em apk para celular.")
}
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        musicaFundo.pause(); // 🔇 pausa quando sai do site
    } else {
        musicaFundo.play(); // 🔊 volta quando retorna
    }
});

window.abrirNivel = abrirNivel;
window.verHistorico = verHistorico;
window.fecharHistorico = fecharHistorico;
window.responder = responder;
window.pausarJogo = pausarJogo;
window.reiniciarJogo = reiniciarJogo;
window.sairJogo = sairJogo;
window.escolherNivel = escolherNivel;
window.abrirConfiguracoes = abrirConfiguracoes;
window.fecharConfig = fecharConfig;
window.toggleModoEscuro = toggleModoEscuro;
window.resetarProgresso = resetarProgresso;
window.trocarNome = trocarNome;
window.saberMais = saberMais;

