// Obtenemos el nombre del circuito a través del parámetro de URL
const urlParams = new URLSearchParams(window.location.search);
const circuitName = urlParams.get('circuit');
const round = urlParams.get('round');
console.log(round);

// URL de la API de Ergast que nos proporciona la información de todos los circuitos de la temporada actual
const circuitsUrl = `https://ergast.com/api/f1/current/circuits.json`;

// Hacemos una solicitud a la API de Ergast para obtener la información de todos los circuitos de la temporada actual
fetch(circuitsUrl)
  .then(response => response.json())
  .then(circuitsData => {
    // Buscamos el circuito que coincide con el nombre recibido como parámetro de URL
    const circuitInfo = circuitsData.MRData.CircuitTable.Circuits.find(circuit => circuit.circuitName.toLowerCase() === circuitName.toString().toLowerCase());
    console.log(circuitInfo);
    const raceInfo = 
    `<div class="page-container">
      <div>
        <h2>${circuitName}</h2>
        <span>${circuitInfo.Location.country},${circuitInfo.Location.locality}</span>
      </div>
      
      <div class="flag-container">
        <img class="country-image" src='${'https://cdn.countryflags.com/thumbs/' + circuitInfo.Location.country.toLowerCase().replace(/ /g, '-') + '/flag-400.png'}'>
      </div>
      
      
    </div>   
    `;

    var circuit_container = document.getElementById('info-circuito');
    circuit_container.innerHTML = raceInfo;

    // Si encontramos el circuito, hacemos otra solicitud a la API de Ergast para obtener los resultados de la carrera correspondiente
    if (circuitInfo) {
      const raceResultsUrl = 'https://ergast.com/api/f1/current/' + round.toString() + '/results.json';
      fetch(raceResultsUrl)
        .then(response => response.json())
        .then(raceResultsData => {
          // Si hay resultados de carrera, mostramos una tabla con la información
          if (raceResultsData.MRData.RaceTable.Races.length > 0) {
            const raceResults = raceResultsData.MRData.RaceTable.Races[0].Results;
            const raceResultsTable = `
              <h3 style="text-align:center">Resultados de la carrera</h3>
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Puesto</th>
                    <th>Piloto</th>
                    <th>Equipo</th>
                    <th>Vuelta más rápida</th>
                    <th>Tiempo total</th>
                  </tr>
                </thead>
                <tbody>
                  ${raceResults.map(result => `
                    <tr>
                      <td>${result.position}</td>
                      <td>${result.Driver.givenName} ${result.Driver.familyName}</td>
                      <td>${result.Constructor.name}</td>
                      <td>${result.FastestLap ? result.FastestLap.Time.time : '-'}</td>
                      <td>${result.Time ? result.Time.time : 'No terminó'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `;

            // Agregamos la tabla de resultados de carrera al contenedor
            const resultsContainer = document.getElementById('resultados-carrera');
            resultsContainer.innerHTML = raceResultsTable;
          }
        })
        .catch(error => {
          // Si hay un error, mostramos un mensaje en la consola
          console.error(`Error al obtener los resultados de la carrera: ${error}`);
        });

      // Creamos una tabla utilizando Bootstrap y mostramos la información del circuito
      const fastestLap = `circuitInfo.FastestLap && circuitInfo.FastestLap.Time ? circuitInfo.FastestLap.Time.time : '-';
            const circuitInfoTable = <table class="table table-bordered"> <thead> <tr> <th colspan="2">${circuitInfo.circuitName}</th> </tr> </thead> <tbody> <tr> <td>País</td> <td>${circuitInfo.Location.country}</td> </tr> <tr> <td>Ciudad</td> <td>${circuitInfo.Location.locality}</td> </tr> <tr> <td>Longitud</td> <td>${circuitInfo.CircuitMap.url} ? <a href='${circuitInfo.CircuitMap.url}' target="_blank">${circuitInfo.CircuitMap.mapWidth} km</a> ${circuitInfo.CircuitMap.mapWidth} km}</td> </tr> <tr> <td>Vuelta más rápida</td> <td>${fastestLap}</td> </tr> </tbody> </table>`;

      // Agregamos la tabla de información del circuito al contenedor
      const circuitInfoContainer = document.getElementById('info-circuito');
      circuitInfoContainer.innerHTML = circuitInfoTable;
    } else {
      // Si no se encuentra el circuito, mostramos un mensaje en el contenedor
      const circuitInfoContainer = document.getElementById('info-circuito');
      circuitInfoContainer.innerHTML = `<p>No se ha encontrado información para el circuito "${circuitName}"</p>`;
    }
  })
  .catch(error => {
    // Si hay un error, mostramos un mensaje en la consola
    console.error(`Error al obtener la información de los circuitos: ${error}`);
  });
