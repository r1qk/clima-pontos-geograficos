// Cidades de onde os dados serão retirados
const cidades = [
    "Corumbá",
    "Aquidauana",
    "Miranda",
    "Cáceres",
    "Poconé",
    "Barão de Melgaço",
    "Porto Jofre",
    "Ladário",
    "Bodoquena",
    "Anastácio"
];

function gerarURL(cidade) {
    return `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cidade + ", Brasil")}&format=json&limit=1`;
};

// Retornando o link da API de cada cidade
function retornarURL(cidades) {
    cidades.forEach(cidade => {
        console.log(cidade);
        console.log(`Link da API: ${gerarURL(cidade)}\n`);
    })
}
retornarURL(cidades);

// Depois de consultar, registrando as longitudes
// O ID é pra usar no HTML
const cidades_coordenadas = [
    { id: "corumba", nome: "Corumbá", estado: "MS", lat: -19.0006027, lon: -57.6507535 },
    { id: "aquidauana", nome: "Aquidauana", estado: "MS", lat: -20.4739690, lon: -55.7821375 },
    { id: "miranda", nome: "Miranda", estado: "MS", lat: -20.2401082, lon: -56.3844728 },
    { id: "caceres", nome: "Cáceres", estado: "MT", lat: -16.0644068, lon: -57.6878972 },
    { id: "pocone", nome: "Poconé", estado: "MT", lat: -16.2578606, lon: -56.6339260 },
    { id: "barao-de-melgaco", nome: "Barão de Melgaço",  estado: "MT", lat: -16.1956788, lon: -55.9668317 },
    { id: "porto-jofre", nome: "Porto Jofre", estado: "MT", lat: -17.3644346, lon: -56.7734733 },
    { id: "ladario", nome: "Ladário", estado: "MS", lat: -19.0036585, lon: -57.6028285 },
    { id: "bodoquena", nome: "Bodoquena", estado: "MS", lat: -20.5508775, lon: -56.6769653 },
    { id: "anastacio", nome: "Anastácio", estado: "MS", lat: -20.7377520, lon: -55.8219708 }
];

// Corumbá -> centro do mapa
const map = L.map('map').setView([cidades_coordenadas[0].lat, cidades_coordenadas[0].lon], 7);
const layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
});
layer.addTo(map);

// Adicionando todos os pontos ao mapa
function adicionarAoMapa(cidades_coordenadas) {
    for (let i = 0; i < 10; i++) {
        const marker = L.marker([cidades_coordenadas[i].lat, cidades_coordenadas[i].lon]);
        marker.addTo(map).bindPopup(`${cidades_coordenadas[i].nome}`); 
    }
}

adicionarAoMapa(cidades_coordenadas);

// Aplicando Open-meteo para conseguir as informações de cada ponto
async function buscarInfoClima (cidade) {
    const URL_open_meteo = `https://api.open-meteo.com/v1/forecast?latitude=${cidade.lat}&longitude=${cidade.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;
    const resposta = await fetch(URL_open_meteo);
    const dados = await resposta.json();
    // pegando temperatura, umidade e velocidade do vento
    let temperatura = dados.current.temperature_2m;
    let umidade = dados.current.relative_humidity_2m;
    let vento = dados.current.wind_speed_10m;

    return {temperatura, umidade, vento};
}

// Função que chama buscarInfoClima e reescreve o HTML
async function iniciar() {
    for (let i = 0; cidades_coordenadas.length; i++) {
        const cidade = cidades_coordenadas[i];
        const resultado = await buscarInfoClima(cidade)
        document.getElementById(`temp-${cidade.id}`).textContent = `🌡 ${resultado.temperatura}°C`;
        document.getElementById(`umidade-${cidade.id}`).textContent = `💧 ${resultado.umidade}%`;
        document.getElementById(`vento-${cidade.id}`).textContent = `💨 ${resultado.vento}km/h`;
    }
}

iniciar();