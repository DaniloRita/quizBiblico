
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
    getDocs, 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    limit 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let jogoFinalizado = false;
let totalPerguntasDesafio = 10;

let nivel = "facil";
let vidas = 3;
let modoDesafio = false;
let nome = "";
let nomeDefinido = false;
window.onload = function () {
    const logado = localStorage.getItem("logado");

    if (logado === "true") {
        document.getElementById("btnLogin").style.display = "none";
    }
};
window.addEventListener("popstate", function () {

    // Se estiver no histórico
    if (document.getElementById("historicoBox").style.display === "block") {
        fecharHistorico();
    }

    // Se estiver no jogo
    else if (document.getElementById("quiz").style.display === "flex") {
        sairJogo();
    }

    // Senão volta pra tela inicial
    else {
        document.getElementById("telaInicial").style.display = "block";
    }
});


window.addEventListener("load", () => {
    const nomeSalvo = localStorage.getItem("nomeJogador");

    if (nomeSalvo) {
        document.getElementById("nomeJogador").value = nomeSalvo;
        nome = nomeSalvo;

        document.getElementById("nomeJogador").style.display = "none";
        document.getElementById("btnIniciar").innerText = "Jogar novamente";
    }
});


const perguntas = [
    { 
        pergunta: "Como se chamava o país onde Jesus vivia?", opcoes: ["Palestina", "Belém", "Nazaré", "Cafarnaum"], correta: 0 
    },
    { 
        pergunta: "Qual a nacionalidade dos que nasceram na Palestina?", opcoes: ["Nazareno", "Judia", "Galileu", "Romano"], correta: 1 
    
    },
    { 
        pergunta: "Como se chama o grande mar que fica no centro do Império Romano?", opcoes: ["Mar Vermelho", "Mar Mediterrâneo", "Mar da Galileia", "Mar da Judéia"], correta:1 
    },
    {
        pergunta: "Quantos quilômetros havia aproximadamente entre Roma e Palestina?", opcoes: ["1500", "2000", "2500", "3000"], correta:2 
    },
    {
        pergunta:"Como se chamava a capital do Império Romano?",opcoes:["Judéia","Nazaré","Roma","Belém"],correta:2
    },
    {
        pergunta:"Quantos anos antes  do descobrimento das Américas Jesus nasceu?",opcoes:["1490","1492","1590","1592"],correta:1},
    {
        pergunta:"Qual era o título do  Imperador Romano",opcoes:["Augusto","Herodes","O grande","César"],correta:3
    },
     {
        pergunta:"Qual dos Dois  grupos políticos entre os judeus: odiava aos romanos?",opcoes:["Publicanos","Zelotes","Simão Pedro","Judas Iscariotes"],correta:1
    },
     {       
        pergunta:"Qual dos Dois  grupos políticos entre os judeus: simpatizava e colaborava com os romanos?",opcoes:["Publicanos","Zelotes","Simão Pedro","Judas Iscariotes"],correta:0
    },
    {
        pergunta:"Em que cidade vivia o Imperador Romano?",opcoes:["Palestina","Belém","Nazaré","Roma"],correta:3
    },
    {
        pergunta:"Que era um publicano?",opcoes:["Zelador da pátria","Cobrador  dos impostos","Judeu revolucionário","Nenhuma das opções"],correta:1
    },
    {
        pergunta:"Qual era a nacionalidade dos publicanos na Palestina?",opcoes:["Nazareno", "Romano", "Galileu", "Judia"],correta:3
    },
    {
        pergunta:"Que era um zelote?",opcoes:["Zelador da pátria","Cobrador  dos impostos","Judeu revolucionário","Nenhuma das opções"],correta:2
    },
    {
        pergunta:"Qual era a nacionalidade dos zelotes?",opcoes:["Nazareno", "Romano", "Galileu", "Judia"],correta:3
    },
    {
        
        pergunta:"Os publicanos e os zelotes eram?",opcoes:["Amigos","Vizinhos","Parentes","Inimigos"],correta:3
    },//Não completo
    {
        pergunta:"Que método usavam os romanos para a pena de morte?",opcoes:["Prisão perpétua","Crucificação","...","...."],correta:1
    },
    {
        pergunta:"Qual dos apóstolos de Cristo simpatizavam com o imperialismo?",opcoes:["Judas Iscariotes","Simão o Zelote","Mateus","Simão Pedro"],correta:2
    },
    {
        pergunta:"Qual dos apóstolos de Cristo simpatizavam com o Nacionalismo?",opcoes:["Judas Iscariotes","Simão o Zelote","Mateus","Simão Pedro"],correta:1
    },
    {
        pergunta:"Que ofício tinha Mateus depois de seguir a Cristo?",opcoes:["Ladrão","Apóstolo de Cristo","Cobrador dos impostos","Nenhuma das opçoes"],correta:1
    },
    {
        pergunta:"Com que Império colaborou Mateus?", opcoes:["Nazareno","Romano","Judeu","Nenhuma das opções"],correta:1       
    },
    {
        pergunta:"Simão o Zelote estava ...... imperialismo?", opcoes:["A favor do","De acordo com","Contra o","Nenhuma das opões"],correta:2
    },
    {
        pergunta:"Qual é tema principal do Evangelho segundo Mateus?", opcoes:["Reino de Deus","Reinos dos Céus","Reino de Cristo","Reino de Jesus"],correta:1
    },
    {
        pergunta:"Como se chama o autor do primeiro  Evagelho?", opcoes:["Genesis","Marcos","Mateus","Êxodo"],correta:2
    },
    {
        pergunta:"Em que reino foram unidos Mateus e Simão o Zelote?", opcoes:["Reino de Deus","Reinos dos Céus","Reino de Cristo","Reino de Satanás"],correta:1
    },
    {
        pergunta:"De que maneira o Reino dos Céus alcança os seus alvos?", opcoes:["Ódio","Vingança","violência","Amor"],correta:3
    },
    {
        pergunta:"De que maneira os movimentos da revolução e Imperialismo alcança os seus alvos?", opcoes:["Honestidade","Pureza","violência","Amor"],correta:2
    },
    {
        pergunta:"Quais são os três nomes bíblicos para o reino de Jesus?", opcoes:["Reino de Deus,de Cristo e de Jesus","Reinos dos Céus, de Jesus e de Cristo","Reino de Cristo,de Céus e Satanás","Nenhuma das opções"],correta:3
    },
    {
        pergunta:"Qual era o Título em Hebraico do Rei esperado pelos Judeus?", opcoes:["Cristo","Jesus","Messias","O grande"],correta:2
    },
    {
        pergunta:"Qual era o Título em Grego do Rei esperado pelos Judeus?", opcoes:["Cristo","Jesus","Messias","O grande"],correta:2
    },
    {
        pergunta:"Quais são os três símbolos de um rei?", opcoes:["Coroa, Trono e vestuário","Calçados,Coroa e Cetro","Cetro, Trono e Coroa","Nenhuma das opções"],correta:2
    },
    {
        pergunta:"Que tem que se fazer a um rei no princípio do seu reinado?", opcoes:["Chicotea-lo","Testa-lo","Aprisiona-lo","Ungi-lo"],correta:3
    },
    {// incompleto
        pergunta:"Que quer dizer os nomes Messias e Cristo?", opcoes:["Ungido","Salvador","Santo","Nenhuma das opções"],correta:0
    },
    {
        pergunta:"Qual é a passagem bíblica que nos ensina buscar primeiro o reino de Deus?", opcoes:["Mateus 5:14","Mateus 6:33","Mateus 10:24","Mateus 20:28"],correta:1
    },
    {
        pergunta:"Qual é o  reino que sempre se opõe ao reino dos céus?", opcoes:["Reino de Satanás","Reino de Jesus","Reino de Deus","Nenhuma das opções"],correta:0
    },
    //PROVA 6 DE OBREIROS APROVADOS
    {
        pergunta:"Qual é a cidade onde morava Jesus durante o Ano de Popularidade?",opcoes:["Cafarnaum","Belém","Nazaré","Jerusalém"], correta:0
    },
        {
        pergunta:"Qual é a cidade onde morava Jesus durante o Ano de Preparação?",opcoes:["Cafarnaum","Belém","Nazaré","Jerusalém"], correta:2
    },
    {
        pergunta:"Qual é a cidadizinha onde Jesus nasceu?",opcoes:["Cafarnaum","Belém","Nazaré","Jerusalém"], correta:1
    },
    {
        pergunta:"Qual é a capital da Palestina?",opcoes:["Cafarnaum","Belém","Nazaré","Jerusalém"], correta:3
    },
    {
        pergunta:"Qual é a carpintaria de Jesus?",opcoes:["Cafarnaum","Belém","Nazaré","Jerusalém"], correta:2
    },
    {
        pergunta:"Qual é a cidade onde viva Jesus quase 30 anos? ",opcoes:["Cafarnaum","Belém","Nazaré","Jerusalém"], correta:2
    },
    {
        pergunta:"Qual é a cidade marítma onde Mateus morava?",opcoes:["Cafarnaum","Belém","Nazaré","Jerusalém"], correta:0
    },        
    {
        pergunta:"Qual é a cidade onde Jesus morreu?",opcoes:["Cafarnaum","Belém","Nazaré","Jerusalém"], correta:3
    },        
    {// PROVA 7 E 8 DE OBREIROS APROVADOS
        pergunta:"Em que rio batizava João Batista?",opcoes:["Rio ...","Rio ...","Rio Jordão","Nenhuma das opções"], correta:2
    },        
    {
        pergunta:"Quais são as duas províncias onde João estava batizando? ",opcoes:["Galileia e Peréia","Judéia e Samaria","Decápolis e Ituréia","Judéia e Peréia"], correta:3
    },        
    {
        pergunta:"Quantos quilômetros mede o mar da Galiléia(largura e comprimento)",opcoes:["10x20","20x20","20x30","10x40"], correta:0
    },        
    {
        pergunta:"Qual é o ano do Ministério de Jesus na Galiléia?",opcoes:["Ano de Preparação","Ano de Popularidade","Ano de Paixão"," Vida Ressuscitada"], correta:1
    },
    { // PROVA 9 E 10 DE OBREIROS APROVADOS
        pergunta:"João pregando o Reino, pertence ao ano de?",opcoes:[" Preparação","Popularidade","Paixão"," Vida Ressuscitada"], correta:1
    },
    {
        pergunta:"Jesus coroado com uma coroa de espinho, pertence ao ano de?",opcoes:[" Preparação","Popularidade","Paixão"," Vida Ressuscitada"], correta:2
    },
    {
        pergunta:"Jesus nasceu na cidadezinha de Belém, pertence ao ano de?",opcoes:[" Preparação","infância","Paixão"," Vida Ressuscitada"], correta:1
    },
    {
        pergunta:"Paulo pregando o Reino em Roma, pertence a?",opcoes:[" Preparação","Popularidade","Paixão"," Vida Ressuscitada"], correta:3
    },
    {
        pergunta:"Jesus abandonou sua carpintaria, pertence ao ano de?",opcoes:[" Preparação","Popularidade","Paixão"," Vida Ressuscitada"], correta:0
    },
    {
        pergunta:"O nascimento de João Batista, pertence ao ano de?",opcoes:[" Infância","Popularidade","Paixão"," Vida Ressuscitada"], correta:0
    },
    {
        pergunta:"Jesus morreu em Jerusalém, pertence ao ano de?",opcoes:[" Preparação","Popularidade","Paixão"," Vida Ressuscitada"], correta:2
    },
    {
        pergunta:"Morte deJoão Baista, pertence ao ano de?",opcoes:[" Preparação","Popularidade","Paixão"," Vida Ressuscitada"], correta:2
    },
    {
        pergunta:"Ministério de Jesus na Galiléia, pertence ao ano de?",opcoes:[" Preparação","Popularidade","Paixão"," Vida Ressuscitada"], correta:1
    },
    {
        pergunta:"Reino pregado em todas nações, pertence a?",opcoes:[" Preparação","Popularidade","Paixão"," Vida Ressuscitada"], correta:3
    },
    {
        pergunta:"Jesus morava em Nazaré, pertence ao ano de?",opcoes:[" Preparação","Popularidade","Paixão"," Vida Ressuscitada"], correta:0
    },
    {
        pergunta:"João Batista encarcerdo, pertence ao ano de?",opcoes:[" Preparação","Popularidade","Paixão"," Vida Ressuscitada"], correta:1
    },
    {
        pergunta:"Jesus em Cafarnaum, pertence ao ano de?",opcoes:[" Preparação","Popularidade","Paixão"," Vida Ressuscitada"], correta:1
    },
    {
        pergunta:"Jesus batizado por João Batista no Rio Jordão, pertence ao ano de?",opcoes:[" Preparação","Popularidade","Paixão"," Vida Ressuscitada"], correta:0
    },
    {// RPOVA 11 DE OBREIROS APROVADOS
        pergunta:"Qual é a ordem das três tecnicas básicass de estudo bíblico?",opcoes:["Interpretação, Observação e Aplicação","Obervação, Aplicação e Interpretação","Aplicação, interpretação e Observação","Observação, Interpretação e Aplicação"], correta:3
    },
    {
        pergunta:"A quem viu Jesus na coletoria?",opcoes:["João","Simão Pedro","Mateus","Judas Iscariotes"],correta:2
    },
    {
        pergunta:"Quem criticou a Jesus por comer com essa gente?",opcoes:["Fariseus","Saduceus","Judeus","Romanos"],correta:0
    },
    {//PROVA 13 DE OBREIROS APROVADOS
        pergunta:"Quantos anúncios do nascimentos de Jesus temos nos Evangelhos?",opcoes:["1","2","3","4"],correta:1
    },
    {
        pergunta:"Em que cidadezinha foram anúnciado o nascimento de Jesus?",opcoes:["Belém","Cafarnaum","Jerusalém","Nazaré"],correta:3
    },
    {
        pergunta:"A quem foi anúnciado o nascimento de Jesus no livro de Mateus?",opcoes:["Maria","José","Os magos","Os pastores"],correta:1
    },
    {
        pergunta:"A quem foi anúnciado o nascimento de Jesus no livro de Marcos?",opcoes:["Maria","José","Os magos","Os pastores"],correta:0
    },
    {
        pergunta:"Maria concebeu Jesus por meio do?",opcoes:["José","Espírito Santo","Anjo Gabriel","Nenhuma das opções"],correta:1
    },
    {
        pergunta:"Quantas natureza tem Jesus?",opcoes:["Uma","Duas","Três","Quatro"],correta:1
    },
    {
        pergunta:"Quantas personalidade tem Jesus?",opcoes:["uma","Duas","Três","Quatro"],correta:0
    },
    {
        pergunta:"O que quer dizer Emanuel?",opcoes:["Deus Contigo","Deus convosco","Deus Consigo","Deus connosco"],correta:3
    },
    {// PROVA 14 DE OBREIROS APROVADOS
        pergunta:"Quantas geneologias de Cristo há nos Evangelho?",opcoes:["Uma","Duas","Três","Quatro"],correta:1
    },
    {
        pergunta:"A qual das geneologias de Jesus os Judeus daria mais importância?",opcoes:["Maria","José","As duas pessoas","Nenhuma das duas pessoas"],correta:1
    },
    {
        pergunta:"Qual é a data de Davi?",opcoes:["600 A.C","1500 A.C","2000 A.C","Nenhuma das opções"],correta:3
    },    
    {
        pergunta:"Quem era protetor legal de Jesus?",opcoes:["Maria","José","As duas pessoas","Nenhuma das duas pessoas"],correta:1
    },
    {
        pergunta:"Qual é a data do exílio á Babilónia?",opcoes:["500 A.C","1000 A.C","2000 A.C","Nenhuma das opções"],correta:3
    },  
    {
        pergunta:"Qual é a data de Abraão?",opcoes:["500 A.C","1000 A.C","2000 A.C","Nenhuma das opções"],correta:2
    }, 
    {
        pergunta:"Quantos antepassados há em cada uma das primeiras três da geneologias?",opcoes:["3","13","15","Nenhuma das opções"],correta:3
    },  
    {//PROVA 15 DE OBREIROS APROVADOS
        pergunta:"Quais são as duas pessoas na geneologia que receberam a promessa em Mateus?",opcoes:["José e Maria","Abraão e José","Davi e Abrão","Davi e Abraão"],correta:3
    }, 
    {
        pergunta:"Qual é o título da éspoca Abrão ?",opcoes:["Reino Vindouro","Reino Vacilante","Reino Verdadeiro","Nenhuma das opções"],correta:3
    }, 
    {
        pergunta:"Qual é o título da éspoca Abraão ?",opcoes:["Reino Vindouro","Reino Vacilante","Reino Verdadeiro","Nenhuma das opções"],correta:0
    }, 
    {
        pergunta:"Qual é o título da éspoca Davi ?",opcoes:["Reino Vindouro","Reino Vacilante","Reino Verdadeiro","Nenhuma das opções"],correta:1
    }, 
    {
        pergunta:"Qual é o título da éspoca Babilónia ?",opcoes:["Reino Vindouro","Reino Vacilante","Reino Verdadeiro","Nenhuma das opções"],correta:2
    }, 
    {
        pergunta:"Qual é o título da éspoca Cristo ?",opcoes:["Reino Vindouro","Reino Vacilante","Reino Verdadeiro","Reino Verdadeiro"],correta:3
    }, 
    {
        pergunta:"Qual é o profeta que observou que Deus ia nascer num berrço?",opcoes:["Daniel","Isaías","Míquéias","Paulo"],correta:1
    },
    {
        pergunta:"Qual dos quatro Evangelho é o mais apropriado para alguém que quer saber se Jesus é o Filho de Deus?",opcoes:["Mateus","Marcos","Lucas","João"],correta:3
    }, 
    {
        pergunta:"Quem é o profeta do Velho Testamento que nos ensinou do Filho do Homem chegando nas nuvens?",opcoes:["Moisés","Josué","Daniel","Jeremias"],correta:2
    }, 
    {
        pergunta:"Dê a referência no Velho Testamento que ensina sobre o Filho do Homem?",opcoes:["Daniel 7:7","Daniel 7:13","Daniel 7:20","Daniel 7:33"],correta:1
    }, 
    {
        pergunta:"Que etapa da humanidade do Messias era especialmente desagradável aos Judeus?",opcoes:["Ascenção","Morte","Ressureção","Nascimento"],correta:2
    }, 
  /*
    {
        pergunta:"?",opcoes:["","","",""],correta:
    },  */












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
document.addEventListener("click", () => {
    musicaFundo.play();
}, { once: true });



musicaFundo.loop = true;
musicaFundo.volume = 0.2;
let perguntasSelecionadas = [...perguntas]
    .sort(() => Math.random() - 0.5)
    .slice(0, TOTAL_PERGUNTAS);

let atual = 0;
let pontuacao = 0;
let tempoPadrao = 30;
let tempoDesafio = 20;
let tempo;
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
    if (
        (modoDesafio && atual >= totalPerguntasDesafio) ||
        (!modoDesafio && atual >= perguntasSelecionadas.length)
    ) {
        finalizarJogo();
        return;
    }


        // 🔇 PARA QUALQUER SOM ANTES
    somTempo.pause();
    somTempo.currentTime = 0;

    // 🔊 COMEÇA NOVO SOM
    tocarSom(somTempo);


if (modoDesafio) {
    tempo = 20; // 🔥 desafio sempre manda
} else {
    if (nivel === "facil") tempo = 30;
    if (nivel === "medio") tempo = 20;
    if (nivel === "dificil") tempo = 10;
}

    const p = perguntasSelecionadas[atual];

    document.getElementById("pergunta").innerText = p.pergunta;

    p.opcoes.forEach((op, i) => {
        document.getElementById("op" + i).innerText = op;
    });

    document.getElementById("resultado").innerText = "";

    document.getElementById("tempo").innerText = "⏱️ " + tempo;

    document.getElementById("progressoTempo").style.width = "100%";
    document.getElementById("progressoTempo").style.background = "lime";

    clearInterval(intervalo);
    iniciarTempo();

}

// ⏱️ TEMPO
function iniciarTempo() {
    intervalo = setInterval(() => {
        if (pausado) return;

        tempo--;

        document.getElementById("tempo").innerText = "⏱️ " + tempo;

    let tempoMax = modoDesafio ? 20 : 30;
    let porcentagem = (tempo / tempoMax) * 100;

        document.getElementById("progressoTempo").style.width = porcentagem + "%";

        if (tempo <= 10) {
            document.getElementById("progressoTempo").style.background = "red";
                somTempo.playbackRate = 1.5; // mais rápido 😱
                tocarSom(somTempo);
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
        // 🔥 AQUI É O LUGAR CERTO
    if (!acertou) {
        if (modoDesafio) {
            finalizarJogo(); // perde na hora
            return;
        }
        vidas--;
    }

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
        tocarSom(somAcerto);

        setTimeout(() => {
            somAcerto.pause();
            somAcerto.currentTime = 0;
        }, 3000);

    } else {
        somErro.currentTime = 0;
        tocarSom(somErro);

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
async function finalizarJogo() {
    if (jogoFinalizado) return;
    jogoFinalizado = true;

    clearInterval(intervalo);

    musicaFundo.pause();
    musicaFundo.currentTime = 0;

    somTempo.pause();
    somTempo.currentTime = 0;

    // 🔥 TOCAR SOM CERTO
    if (vidas > 0) {
        somVitoria.currentTime = 0;
tocarSom(somVitoria);

    } else {
        somDerrota.currentTime = 0;
        tocarSom(somDerrota);
    }

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
    if (!window.db) return "-";

    try {
        const querySnapshot = await getDocs(collection(window.db, "ranking"));

        let lista = [];

        querySnapshot.forEach((doc) => {
            lista.push(doc.data());
        });

        if (lista.length === 0) return "-"; // 🔥 evita bug

        // ordena
        lista.sort((a, b) => b.pontos - a.pontos);

        // 🔥 usa posição pelo score (mais seguro)
        let posicao = lista.findIndex(item =>
            item.nome === nome && item.pontos === pontuacao
        );

        if (posicao === -1) return "-";

        return posicao + 1;

    } catch (e) {
        console.log("Erro ao obter posição:", e);
        return "-";
    }
}

// 🔄 REINICIAR
function iniciarJogo() {
        history.pushState({ pagina: "jogo" }, "");

    // 🔊 som
    somClick.currentTime = 0;
    tocarSom(somClick);

    let nomeSalvo = localStorage.getItem("nomeJogador");

    if (nomeSalvo) {
        nome = nomeSalvo;
    } else {
        nome = document.getElementById("nomeJogador").value;

        if (nome.trim() === "") {
            alert("Digite seu nome!");
            return;
        }

        localStorage.setItem("nomeJogador", nome);
    }

    // 🔥 AGORA FORA DO IF (IMPORTANTE)
    if (modoDesafio) {
        tempo = 20; // desafio
    } else {
        tempo = 30; // normal
    }

    document.getElementById("tempo").innerText = tempo;

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
        tocarSom(musicaFundo);
        tocarSom(somTempo);

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

async function verHistorico() {
    const box = document.getElementById("historicoBox");
    const conteudo = document.getElementById("historicoConteudo");

    box.style.display = "block";
    conteudo.innerHTML = "Carregando...";

    try {
        // 🔥 NORMAL
        const normalSnap = await getDocs(collection(window.db, "ranking"));

        let normal = [];
        normalSnap.forEach(doc => normal.push(doc.data()));

        normal.sort((a, b) => b.pontos - a.pontos);
        normal = normal.slice(0, 5);

        // 🔥 DESAFIO
        const desafioSnap = await getDocs(collection(window.db, "ranking_desafio"));

        let desafio = [];
        desafioSnap.forEach(doc => desafio.push(doc.data()));

        desafio.sort((a, b) => b.pontos - a.pontos);
        desafio = desafio.slice(0, 5);

        // 🔥 MOSTRAR
        conteudo.innerHTML = "<h3>🌍 Ranking Mundial</h3>";

        normal.forEach((item, i) => {
            conteudo.innerHTML += `<p>#${i+1} - ${item.nome} (${item.pontos})</p>`;
        });

        conteudo.innerHTML += "<h3>🔥 Ranking Desafio</h3>";

        desafio.forEach((item, i) => {
            conteudo.innerHTML += `<p>#${i+1} - ${item.nome} (${item.pontos})</p>`;
        });

    } catch (e) {
        console.log(e);
        conteudo.innerHTML = "Erro ao carregar ranking";
    }
        history.pushState({ pagina: "historico" }, "");

        mostrarRanking("normal"); // 🔥 começa com mundial
}

function reiniciarJogo() {
    pontuacao = 0;
    atual = 0;
    tempo = 30;
    vidas = modoDesafio ? 1 : 3;


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
    if (!window.db) return;

    const colecao = modoDesafio ? "ranking_desafio" : "ranking";

    await addDoc(collection(window.db, colecao), {
        nome: nome,
        pontos: pontuacao
    });
}

function trocarNome() {
    let novoNome = prompt("Digite seu novo nome:");

    if (novoNome) {
        nome = novoNome;

        localStorage.setItem("nomeJogador", novoNome);

        document.getElementById("nomeJogador").value = novoNome;
    }
    if (!nome) {
    alert("Digite seu nome!");
    return;
}

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
    nome = document.getElementById("nomeJogador").value;

    // 🔥 SALVA NO NAVEGADOR
    localStorage.setItem("nomeJogador", nome);

    document.getElementById("menuNivel").style.display = "flex";
}
function iniciarDesafio() {
    modoDesafio = true;
    vidas = 1;
    pontuacao = 0;
    atual = 0;
    document.getElementById("vidas").innerText = "❤️ " + vidas;

    // 🔥 PEGA 10 PERGUNTAS NO DESAFIO
    perguntasSelecionadas = [...perguntas]
        .sort(() => Math.random() - 0.5)
        .slice(0, totalPerguntasDesafio);

    console.log("Modo desafio ativado");

    iniciarJogo();
}

function escolherNivel(n) {
        // 🔊 toca som de clique
    somClick.currentTime = 0;
    tocarSom(somClick);
    nivel = n;

    document.getElementById("menuNivel").style.display = "none";

    iniciarJogo(); // 🔥 só começa depois de escolher
}
function saberMais(){
    alert("O jogo surgiu por causa do estudo de Obreiros Aprovados, na qual aprendemos muito sobre a vida de Jesus então decidi transformar isso em apk para celular.")
}
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        musicaFundo.pause();
    } else {
        tocarSom(musicaFundo);
    }
});

async function loginGoogle() {
    try {
        const result = await signInWithPopup(window.auth, window.provider);

        const user = result.user;

        nome = user.displayName;

        document.getElementById("nomeJogador").value = nome;

        // 🔥 SALVA QUE ESTÁ LOGADO
        localStorage.setItem("logado", "true");

        // 🔥 ESCONDE BOTÃO
        document.getElementById("btnLogin").style.display = "none";

        alert("Logado como " + nome);

    } catch (e) {
        console.log(e);
        alert("Erro no login");
    }
}
async function mostrarRanking(tipo) {

    const conteudo = document.getElementById("historicoConteudo");
    conteudo.innerHTML = "Carregando...";

    const colecao = tipo === "desafio" ? "ranking_desafio" : "ranking";

    try {
        const snapshot = await getDocs(collection(window.db, colecao));

        let lista = [];
        snapshot.forEach(doc => lista.push(doc.data()));

        lista.sort((a, b) => b.pontos - a.pontos);

let html = "";

const jogadorAtual = localStorage.getItem("nomeJogador");

lista.slice(0, 10).forEach((item, i) => {

    let medalha = "";

    if (i === 0) medalha = "🥇";
    else if (i === 1) medalha = "🥈";
    else if (i === 2) medalha = "🥉";
    else medalha = `${i+1}`;

    let destaque = item.nome === jogadorAtual ? "jogador" : "";

    html += `<p class="${destaque}">
        ${medalha} - ${item.nome} (${item.pontos})
    </p>`;
});

        conteudo.innerHTML = html;

        // 🔥 marcar aba ativa
        document.getElementById("tabMundial").classList.remove("ativo");
        document.getElementById("tabDesafio").classList.remove("ativo");

        if (tipo === "normal") {
            document.getElementById("tabMundial").classList.add("ativo");
        } else {
            document.getElementById("tabDesafio").classList.add("ativo");
        }

    } catch (e) {
        console.log(e);
        conteudo.innerHTML = "Erro ao carregar ranking";
    }
}
function tocarSom(audio) {
    if (!somAtivo) return; // 🔥 respeita config de som

    audio.currentTime = 0;
    audio.play().catch(() => {
        console.log("Som bloqueado");
    });
}




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
window.iniciarDesafio = iniciarDesafio;
window.loginGoogle = loginGoogle;
window.mostrarRanking = mostrarRanking;

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(() => console.log("SW registrado"));
}
