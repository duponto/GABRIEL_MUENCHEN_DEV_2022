let times = [];
let rodadas = [];
let rodadasTotais = 0;
let pontuacao = {};

$(document).ready(function() {
  $('[class$="vencedor"').hide();
});

confereTextArea = () => {
  //permite gerar resultados novamente
  times = [];
  pontuacao = {};
  $("#tab_jogos tbody").empty();
  document.getElementById('campeao').innerHTML = '';

  text = document.getElementById("times_estados").value;
  text = text.split("\n");
  text.map((textArray) => {
    const timeNome = textArray.split(";")[0];
    times.push({
      nome: timeNome,
      estado: textArray.split(";")[1],
    });
    pontuacao[timeNome] = 0;
  });
  criaTimes();
};

criaTimes = () => {
  const aux = { nada: "nada" };
  const auxTimesRep = [...times];
  if (auxTimesRep.length % 2 === 1) {
    auxTimesRep.push(aux);
  }

  const n = auxTimesRep.length;

  for (let j = 0; j < n - 1; j += 1) {
    rodadas[j] = [];
    for (let i = 0; i < n / 2; i += 1) {
      const timeA = { ...auxTimesRep[i] };
      const timeB = { ...auxTimesRep[n - 1 - i] };
      if (!timeA.nada && !timeB.nada) {
        rodadas[j].push([timeA, timeB]);
      }
    }
    auxTimesRep.splice(1, 0, auxTimesRep.pop());
  }
  const volta = rodadas.map((rodada) =>
    rodada.map((partida) => [partida[1], partida[0]])
  );
  const campeonato = [...rodadas, ...volta];
  console.log(campeonato);
  criaLinhas(campeonato);
};

criaLinhas = (campeonato) => {
  const tab = document.getElementById("tab_jogos").tBodies[0];
  let media = 0;
  let gols = 0;
  //campeonato[rodada][partida][time]
  for (let i = 0; i < campeonato.length; i++) {
    //rodada
    const linhaRodada = tab.insertRow();
    linhaRodada.setAttribute("style", "background-color:black;color:white");
    for (let zz = 0; zz < 6; zz++) {
      if (zz == 5) {
        const rodada = linhaRodada.insertCell();
        rodada.innerHTML ="Rodada " + (i + 1);
        rodada.align="center";
      }
      linhaRodada.insertCell();
    }

    for (let j = 0; j < campeonato[i].length; j++) {
      //partida
      const [ponto1, ponto2] = golsPontos(
        campeonato[i][j][0].nome,
        campeonato[i][j][1].nome
      );
      const linha = tab.insertRow();

      linha.insertCell().innerHTML = campeonato[i][j][0].nome.toUpperCase();
      linha.insertCell().innerHTML = ponto1;
      linha.insertCell().innerHTML = "X";
      linha.insertCell().innerHTML = ponto2;

      time2 = linha.insertCell();
      time2.innerHTML = campeonato[i][j][1].nome.toUpperCase();
      time2.align = "right";

      const rodadaAtual = linha.insertCell();
      rodadaAtual.align="center";
      rodadaAtual.innerHTML = rodadaDupla(
        campeonato[i],
        campeonato[i][j][0].estado
      );

      estado = linha.insertCell();
      estado.innerHTML = campeonato[i][j][0].estado.toUpperCase();
      estado.align = "center";
    }    
  }
  console.log(pontuacao);
  campeao();
};

rodadaDupla = (rodada, estado) => {
  const count = rodada.filter((r) => r[0].estado == estado).length;
  if (count > 1) {
    return "(Rodada Dupla)";
  }
  return "";
};

golsPontos = (time1, time2) => {
  //Math.random() * 5 para valores mais plausíveis
  const ponto1 = parseInt(Math.random() * 5);
  const ponto2 = parseInt(Math.random() * 5);
  if (ponto1 > ponto2) {
    pontuacao[time1] = pontuacao[time1] + 3;
  } else if (ponto2 > ponto1) {
    pontuacao[time2] = pontuacao[time1] + 3;
  } else {
    pontuacao[time1] = pontuacao[time1] + 1;
    pontuacao[time2] = pontuacao[time2] + 1;
  }  
  return [ponto1, ponto2];
};

campeao = () => {
  const pontosMax = Math.max(...Object.values(pontuacao));
  const campeoes = []; //possibilidade de empate
  for(let time in pontuacao){
    if(pontuacao[time] === pontosMax){
      campeoes.push(time);
    }
  }
  $('[class$="vencedor"').show();
  if(campeoes.length == 1){
    $('[class$="vencedorcor"').css({"border":"1px solid green","background-color": "lightgreen"});
    document.getElementById('campeao').innerHTML = 'VENCEDOR : '+campeoes[0].toUpperCase()+' ('+pontosMax+' pontos)';
  }else if(campeoes.length > 1){
    $('[class$="vencedorcor"').css({"border":"1px solid black","background-color": "lightblue"});
    document.getElementById('campeao').innerHTML = 'EMPATE ENTRE : '
    document.getElementById('campeao').innerHTML += campeoes.join(', ').toUpperCase()+' ('+pontosMax+' pontos)';
  }  
}
