
/*********** Sidenav ************/

function abrirInfo(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}
//---------------------------------------------------------------------------------------------------

/*
    Os dados a utilizados são provenientes da API
    https://covid19-brazil-api.vercel.app/api/report/v1/countries
*/

google.charts.load('current', {
    'packages': ['geochart'],
});
google.charts.setOnLoadCallback(desenharMapa);

function desenharMapa() {
    var data = google.visualization.arrayToDataTable(casosPaises);

    var options = {
        backgroundColor: '#90d9f9',
        colorAxis: { colors: ['lightgreen', 'green', 'darkgreen'] }
    };
    var chart = new google.visualization.GeoChart(document.getElementById('area-mapa'));

    chart.draw(data, options);
}

let letMapa = document.getElementById('area-mapa');
async function carregarMapa() {

    let erro = document.getElementById('div-erro');
    erro.style.display = 'none';

    await fetch('https://covid19-brazil-api.vercel.app/api/report/v1/countries')
        .then(response => response.json())
        .then(dados => preparandoDados(dados))
        .catch(e => exibirErro(e.mensage));
}

function exibirErro(mensagem) {
    let erro = document.getElementById('div-erro');
    erro.style.display = 'block';
    erro.innerHTML = '<b>Erro ao carregar a API:</b><br />' + mensagem;
}

function preparandoDados(dados) {
    casosPaises = [
        ['pais', 'casos']
    ]
    for (let i = 0; i < dados['data'].length; i++) {
        casosPaises.push(
            [dados['data'][i].country,
            dados['data'][i].confirmed]
        )
    }

    letMapa.style.display = 'block';
    desenharMapa()
}

var casosPaises = [
    ['pais', 'casos'],
    ['0', 0]
]


//---------------------------------------------------------------------------------------------------
/*************Gráfico de Pizza***************/

let graficoPizza = document.getElementById('grafico-pizza');
async function carregarPizza() {

    let erro = document.getElementById('div-erro');
    erro.style.display = 'none';

    await fetch('https://covid19-brazil-api.vercel.app/api/report/v1/countries')
        .then(response => response.json())
        .then(dados => prepararPizza(dados))
        .catch(e => exibirErro(e.mensage));
}

function prepararPizza(dados) {
    casosPaises = [
        ['pais', 'casos']
    ]
    for (let i = 0; i < dados['data'].length; i++) {
        casosPaises.push(
            [dados['data'][i].country,
            dados['data'][i].deaths]
        )
    }
    letMapa.style.display = 'none';
    graficoPizza.style.display = 'block';

    pizzaPronta()
}
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(pizzaPronta);

function pizzaPronta() {

    var data = google.visualization.arrayToDataTable(casosPaises);

    var options = {
        title: 'Casos Confirmados/Mortos',
        backgroundColor: '#9bfab0'
    }

    var chart = new google.visualization.PieChart(document.getElementById('grafico-pizza'));

    chart.draw(data, options);
}


/*---------------------------------------------Tabela-----------------------------------------------*/

async function carregarDados() {

    await fetch('https://covid19-brazil-api.vercel.app/api/report/v1')
        .then(response => response.json())
        .then(dados => prepararDados(dados))
        .catch(e => exibirErro(e.message));
}

function exibirErro(mensagem) {
    let erro = document.getElementById('div-erro');
    erro.style.display = 'block';
    erro.innerHTML = '<b>Erro ao carregar a API:</b><br />' + mensagem;
}


google.charts.load('current', { 'packages': ['table'] });
google.charts.setOnLoadCallback(prepararDados);
function prepararDados(dados) {

    let linhas = document.getElementById('linhas');
    linhas.innerHTML = '';

    for (let i = 0; i < dados['data'].length; i++) {
        let auxLinha = '';

        if (i % 2 != 0)
            auxLinha = '<tr class="listra">';
        else
            auxLinha = '<tr>';

        auxLinha += '<td>' + dados['data'][i].uf + '</td>' +
            '<td>' + dados['data'][i].state + '</td>' +
            '<td>' + dados['data'][i].cases + '</td>' +
            '<td>' + dados['data'][i].deaths + '</td>' +
            '<td>' + dados['data'][i].suspects + '</td>' +
            '<td>' + dados['data'][i].refuses + '</td>' +
            '</tr>';

        linhas.innerHTML += auxLinha;
    }
}