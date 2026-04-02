const musicas = [
    {
        titulo: "Porque Ele Vive",
        letra: "Deus enviou seu Filho amado\npara salvar e perdoar...",
        categoria: "louvor"
    },
    {
        titulo: "Grandioso És Tu",
        letra: "Senhor meu Deus, quando\neu maravilhado...",
        categoria: "hinario"
    },
    {
        titulo: "Rude Cruz",
        letra: "Rude cruz se erigiu, dela a glória fugiu...",
        categoria: "adoracao"
    }
];

const telaApresentacao = document.getElementById("telaApresentacao");
const textoApresentacao = document.getElementById("textoApresentacao");
const lista = document.getElementById("listaMusicas");
const listaFavoritos = document.getElementById("listaFavoritos");
const listaHistorico = document.getElementById("listaHistorico");
const telaLetra = document.getElementById("telaLetra");
const telaFavoritos = document.getElementById("telaFavoritos");
const telaHistorico = document.getElementById("telaHistorico");
const telaDefinicoes = document.getElementById("telaDefinicoes");

const tituloLetra = document.getElementById("tituloLetra");
const textoLetra = document.getElementById("textoLetra");
const btnFavorito = document.getElementById("btnFavorito");
const main = document.querySelector("main");

let tamanhoFonte = 18;
let musicaAtual = null;

/* ------------------ CARREGAR DADOS ------------------ */

let historico = [];

const historicoSalvo = JSON.parse(localStorage.getItem("historico"));
if(historicoSalvo){
    historico = historicoSalvo;
}

const favoritosSalvos = JSON.parse(localStorage.getItem("favoritos"));
if(favoritosSalvos){
    musicas.forEach(m => {
        const achado = favoritosSalvos.find(f => f.titulo === m.titulo);
        if(achado){
            m.favorito = true;
        }
    });
}

/* ------------------ LISTA PRINCIPAL ------------------ */

mostrarMusicas(musicas);


/* ------------------ ABRIR MÚSICA ------------------ */

function abrirMusica(musica){

    musicaAtual = musica;

    adicionarHistorico(musica);

    tituloLetra.textContent = musica.titulo;
    textoLetra.textContent = musica.letra;

    tamanhoFonte = 16;
    textoLetra.style.fontSize = tamanhoFonte + "px";

    btnFavorito.classList.remove("ativo");
    if(musica.favorito){
        btnFavorito.classList.add("ativo");
    }

    esconderTudo();
    telaLetra.style.display = "flex";
}

/* ------------------ TOPO ------------------ */

function voltar(){
    esconderTudo();
    main.style.display = "block";
}

function aumentarFonte(){
    tamanhoFonte += 2;
    textoLetra.style.fontSize = tamanhoFonte + "px";
}

function diminuirFonte(){
    if(tamanhoFonte > 10){
        tamanhoFonte -= 2;
        textoLetra.style.fontSize = tamanhoFonte + "px";
    }
}

/* ------------------ FAVORITOS ------------------ */

function favoritar(){

    if(!musicaAtual) return;

    musicaAtual.favorito = !musicaAtual.favorito;

    if(musicaAtual.favorito){
        btnFavorito.classList.add("ativo");
        btnFavorito.textContent = "❤️";
    }else{
        btnFavorito.classList.remove("ativo");
        btnFavorito.textContent = "♡";
    }

    salvarFavoritos();
}


function salvarFavoritos(){

    const favoritos = musicas
        .filter(m => m.favorito)
        .map(m => ({ titulo: m.titulo }));

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

/* ------------------ HISTÓRICO ------------------ */

function adicionarHistorico(musica){

    historico = historico.filter(m => m.titulo !== musica.titulo);

    historico.unshift({
        titulo: musica.titulo,
        letra: musica.letra
    });

    if(historico.length > 20){
        historico.pop();
    }

    salvarHistorico();
}

function salvarHistorico(){
    localStorage.setItem("historico", JSON.stringify(historico));
}

/* ------------------ TELAS ------------------ */

function esconderTudo(){
    main.style.display = "none";
    telaFavoritos.style.display = "none";
    telaHistorico.style.display = "none";
    telaDefinicoes.style.display = "none";
    telaLetra.style.display = "none";
}

function abrirTela(nome){

    esconderTudo();

    if(nome === "inicial"){
        main.style.display = "block";
    }

    if(nome === "favoritos"){
        atualizarFavoritos();
        telaFavoritos.style.display = "block";
    }

    if(nome === "historico"){
        atualizarHistorico();
        telaHistorico.style.display = "block";
    }

    if(nome === "definicoes"){
        telaDefinicoes.style.display = "block";
    }
}

/* ------------------ LISTA FAVORITOS ------------------ */

function atualizarFavoritos(){

    listaFavoritos.innerHTML = "";

    const categorias = ["louvor","hinario","coros"];

    categorias.forEach(cat => {

        const listaCat = musicas.filter(
            m => m.favorito && m.categoria === cat
        );

        if(listaCat.length === 0) return;

        const titulo = document.createElement("h4");
        titulo.textContent = cat.toUpperCase();
        listaFavoritos.appendChild(titulo);

        listaCat.forEach(musica => {

            const li = document.createElement("li");
            li.textContent = musica.titulo;
            li.onclick = () => abrirMusica(musica);

            listaFavoritos.appendChild(li);
        });
    });
}

/* ------------------ LISTA HISTÓRICO ------------------ */

function atualizarHistorico(){

    listaHistorico.innerHTML = "";

    if(historico.length === 0){
        listaHistorico.innerHTML = "<li>Histórico vazio.</li>";
        return;
    }

    historico.forEach(musica => {

        const li = document.createElement("li");
        li.textContent = musica.titulo;

        li.onclick = () => abrirMusica(musica);

        listaHistorico.appendChild(li);
    });
}



/* ------------------ TEMAS ------------------ */

const topoApp = document.querySelector(".topoApp");
const menu = document.querySelector(".menu");

const temas = {
    azul: "linear-gradient(180deg, #010f25, #42a5f5, #0e83e3)",
    verde: "linear-gradient(180deg, #052e08,hsl(139, 82%, 34%), #44e94c)",
    vermelho: "linear-gradient(180deg, #520303, #870d0b, #ef5350)",
    rosa: "linear-gradient(180deg, #480227, #76032a, #c80647)"
};

const temaSalvo = localStorage.getItem("temaApp");

if (temaSalvo) {
    aplicarTema(temaSalvo);
} else {
    aplicarTema("azul");
}

function mudarTema(nome){
    aplicarTema(nome);
    localStorage.setItem("temaApp", nome);
}

function aplicarTema(nome){

    const degradado = temas[nome];

    topoApp.style.background = degradado;
    menu.style.background = degradado;
}
let categoriaAtual = null;

/* -------- MOSTRAR MÚSICAS -------- */

function mostrarMusicas(listaDeMusicas){

    lista.innerHTML = "";

    const ordenadas = listaDeMusicas
        .slice()
        .sort((a,b) => a.titulo.localeCompare(b.titulo));

    ordenadas.forEach(musica => {

        const li = document.createElement("li");
        li.textContent = musica.titulo;
        li.onclick = () => abrirMusica(musica);

        lista.appendChild(li);
    });

    if(ordenadas.length === 0){
        lista.innerHTML = "<li>Nenhuma música encontrada.</li>";
    }
}

/* -------- FILTRO POR CATEGORIA -------- */

function filtrarCategoria(cat){

    categoriaAtual = cat;

    document.getElementById("pesquisa").value = "";

    const filtradas = musicas.filter(m => m.categoria === cat);

    mostrarMusicas(filtradas);
}

/* -------- PESQUISA -------- */

function filtrarMusicas(){

    const texto = document
        .getElementById("pesquisa")
        .value
        .toLowerCase();

    let base = musicas;

    if(categoriaAtual){
        base = musicas.filter(m => m.categoria === categoriaAtual);
    }

    const filtradas = base.filter(m =>
        m.titulo.toLowerCase().includes(texto)
    );

    mostrarMusicas(filtradas);
}
let apresentacao = false;

function modoApresentacao(){

    apresentacao = !apresentacao;

    const topo = document.querySelector(".topoLetra");

    if(apresentacao){
        topo.style.display = "none";
        textoLetra.style.fontSize = "26px";
    }else{
        topo.style.display = "flex";
        textoLetra.style.fontSize = tamanhoFonte + "px";
    }
}
let intervaloRolagem = null;

function autoRolagem(){

    if(intervaloRolagem){
        clearInterval(intervaloRolagem);
        intervaloRolagem = null;
        return;
    }

    intervaloRolagem = setInterval(() => {
        textoLetra.scrollTop += 1;
    }, 40);
}
function marcarTrecho(){

    if(!musicaAtual) return;

    musicaAtual.marcacao = textoLetra.scrollTop;

    alert("Trecho marcado!");
}

function irParaTrecho(){
    if(musicaAtual && musicaAtual.marcacao != null){
        textoLetra.scrollTop = musicaAtual.marcacao;
    }
}
function limparHistorico(){

    if(!confirm("Deseja apagar o histórico?")) return;

    historico = [];
    localStorage.removeItem("historico");
    atualizarHistorico();
}


function esconderTudo(){
    main.style.display = "none";
    telaFavoritos.style.display = "none";
    telaHistorico.style.display = "none";
    telaDefinicoes.style.display = "none";
    telaLetra.style.display = "none";
    telaApresentacao.style.display = "none";
}
function modoApresentacao(){

    telaLetra.classList.toggle("apresentacao");

}
let emApresentacao = false;

function modoApresentacao(){

    if(!textoLetra) return;

    emApresentacao = true;

    // letra ENORME no modo apresentação
    tamanhoFonte = 48;
    textoLetra.style.fontSize = tamanhoFonte + "px";
}
window.addEventListener("load", () => {

    setTimeout(() => {

        document.getElementById("splash").style.display = "none";
        document.getElementById("app").style.display = "block";

    }, 1000);

});
const notaInput = document.getElementById("notaMusica");

function abrirMusica(musica){

    musicaAtual = musica;

    adicionarHistorico(musica);

    tituloLetra.textContent = musica.titulo;
    textoLetra.textContent = musica.letra;

    const notaSalva = localStorage.getItem("nota_" + musica.titulo);
    notaInput.value = notaSalva ? notaSalva : "";

    esconderTudo();
    telaLetra.style.display = "flex";
}

function salvarNota(){
    if(!musicaAtual) return;

    localStorage.setItem(
        "nota_" + musicaAtual.titulo,
        notaInput.value
    );
    alert("✅ Nota guardada!")
}
