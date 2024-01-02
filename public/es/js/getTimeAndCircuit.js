async function getTime(date, hour, circuit, container) {
    const circuitName = circuit.circuitName;
    const circuitLat = circuit.Location.lat;
    const circuitLong = circuit.Location.long;

    // Use the circuit information to get weather data from the Open-Meteo API
    await fetch(`https://api.open-meteo.com/v1/forecast?days=16&latitude=${circuitLat}&longitude=${circuitLong}&hourly=temperature_2m&hourly=precipitation_probability&hourly=windspeed_10m&forecast_days=16`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Extract the weather information for the specified date and hour
        let html = '';
        for (let i = 0; i < data.hourly.time.length; i++) {
          let dateTime = data.hourly.time[i];
          let date2 = dateTime.split("T")[0];
          let hour2 = dateTime.split("T")[1];
          let res = '';
          if (date2 === date && hour2 === hour) {
            const temperature = data.hourly.temperature_2m[i];
            const precipitationProbability = data.hourly.precipitation_probability[i];
            const windSpeed = data.hourly.windspeed_10m[i];
            temperature_img = (temperature >= 20) ? '../img/weather/time2.png' : '../img/weather/time1.png';
            res = `<span><br><img class="country-weather" src=${temperature_img}> ${temperature}°C  <img class="country-weather" src='../img/weather/time3.png'> ${precipitationProbability}%  <img class="country-weather-wind" src='../img/weather/time4.png'> ${windSpeed} m/s</span>`;
            container.innerHTML += res;
          }

        }

      });
  }
  getCircuiteSchedule();
  async function getCircuiteSchedule() {
    await fetch('https://ergast.com/api/f1/current/next.json')
      .then(response => response.json())
      .then(data => {
        // obtener el nombre del gp y bandera
        const circuitName = data.MRData.RaceTable.Races[0].raceName;
        let div_container = document.getElementById('gp-title');
        div_container.innerHTML += circuitName;
        let flagcountry = data.MRData.RaceTable.Races[0].Circuit.Location.country;
        let gpFlag = document.querySelector('.image-gp');
        gpFlag.src = 'https://cdn.countryflags.com/thumbs/' + flagcountry.toLowerCase().replace(/ /g, '-') + '/flag-400.png';

        //imagen de circuito
        let circuitimage = document.getElementById('circuit-image');
        let hasErrorOccurred = 0;
        circuitimage.src = 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/' + flagcountry + '_Circuit.png.transform/8col/image.png';
        circuitimage.onerror = function () {
          if (hasErrorOccurred == 0) {
            // Use city in flagcountry variable if image URL is not valid
            let city = data.MRData.RaceTable.Races[0].Circuit.Location.locality;
            circuitimage.src = 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/' + city + '_Circuit.png.transform/8col/image.png';
            hasErrorOccurred++;
          }
          else if(hasErrorOccurred == 1){
            // Use city in flagcountry variable if image URL is not valid
            let city = data.MRData.RaceTable.Races[0].Circuit.Location.locality;
            circuitimage.src = `https://e00-marca.uecdn.es/deporte/motor/formula1/img/circuitos/${flagcountry.toLowerCase()}.jpg`;
            hasErrorOccurred++;
          }
          else if(hasErrorOccurred == 2){
            // Use city in flagcountry variable if image URL is not valid
            let city = data.MRData.RaceTable.Races[0].Circuit.Location.locality;
            circuitimage.src = `https://e00-marca.uecdn.es/deporte/motor/formula1/img/circuitos/${city.toLowerCase()}.jpg`;
            hasErrorOccurred++;
          }
          else {
            circuitimage.onerror = null;
          }
        }


        // obtener la fecha y la hora del circuito
        let uy = document.getElementById('date-gp');
        var fecha = new Date(data.MRData.RaceTable.Races[0].date);
        var mes = fecha.toLocaleString('es-ES', { month: 'long' });
        uy.innerHTML = fecha.getDate() + ' de ' + mes;

        let city_weather = data.MRData.RaceTable.Races[0].Circuit.Location.city;

        //nombre circuito
        let iin = document.getElementById('name-circuit');
        iin.innerHTML = data.MRData.RaceTable.Races[0].Circuit.circuitName;

        //creacion de tabla
        var table = document.getElementById("tabla-horari");

        const circuit = data.MRData.RaceTable.Races[0].Circuit;
        const race1 = data.MRData.RaceTable.Races[0];

        var sessionValues = {
          "FirstPractice": "FP1",
          "Sprint": "Sprint",
          "Qualifying": "Qualy",
          "ThirdPractice": "FP3",
          "SecondPractice": "FP2",
        };

        // Usar un bucle para recorrer los datos y asignar los valores a las celdas
        // Usar un bucle para recorrer las propiedades del objeto Races[0]
        var race = data.MRData.RaceTable.Races[0];
        var i = 0; // variable para contar las filas
        for (var session in race) {
          // Solo mostrar las propiedades que empiecen por F, S o Q (las sesiones)

          if (session[0] === "F" || session[0] === "Sprint" || session[0] === "S" || session[0] === "Q" || session[0] === "T") {
            // Obtener la fila i-ésima de la tabla
            var img = document.createElement('img');
            img.src = 'https://cdn.countryflags.com/thumbs/spain/flag-400.png';
            img.classList.add('country-horari');
            var tr = table.rows[i]; // se suma 1 porque la primera fila es el thead
            // Obtener las celdas de la fila y asignarles los valores
            var td1 = tr.cells[0];

            td1.textContent = sessionValues[session]; // el nombre de la sesión es la propiedad del objeto
            const td2 = tr.cells[1];
            td2.style.textAlign = 'center';

            var fecha_session = new Date(race[session].date);
            td2.innerHTML += '<span class="session-date" style="align-text:center;">' + fecha_session.getDate() + ' de ' + fecha_session.toLocaleString('es-ES', { month: 'long' }) + " " + convertirHoraZ(race[session].time) + '</span>'; // el horario es el valor de la propiedad
            td2.appendChild(img);
            i++; // incrementar el contador de filas
            const time = getTime(race[session].date, Math.floor(parseInt(convertirHoraZ(race[session].time))).toString() + ":00", circuit, td2);
          }
        }

        var tr = table.rows[4];
        var td1 = tr.cells[0];
        td1.textContent = 'Carrera';
        const td2 = tr.cells[1];
        td2.style.textAlign = 'center';
        var fecha_session = new Date(race.date);
        td2.innerHTML += '<span class="session-date" style="align-text:center;">' + fecha_session.getDate() + ' de ' + fecha_session.toLocaleString('es-ES', { month: 'long' }) + " " + convertirHoraZ(race.time) + '</span>';
        var img = document.createElement('img');
        img.src = 'https://cdn.countryflags.com/thumbs/spain/flag-400.png';
        img.classList.add('country-horari');
        td2.appendChild(img);
        getTime(race.date, Math.floor(parseInt(convertirHoraZ(race.time))).toString() + ":00", circuit, td2);


      });


    function convertirHoraZ(horaZ) {
      // Convertir la hora al formato reconocido por el objeto Date
      var horaConvertida = '1970-01-01T' + horaZ;
      // Crear un objeto Date con la hora UTC
      var fechaUTC = new Date(horaConvertida);
      // Obtener la diferencia de tiempo en minutos entre la hora local y UTC
      var diferencia = fechaUTC.getTimezoneOffset();
      // Calcular la hora local en España
      var horaLocal = new Date(fechaUTC.getTime() - diferencia * 60000);
      // Devolver la hora local en formato hh:ss
      return horaLocal.toLocaleString('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' });
    }

    async function startCountdown() {
      // Get the next race date and circuit name from the Ergast API
      const response = await fetch('https://ergast.com/api/f1/current/next.json');
      const data = await response.json();
      const nextRaceDate = new Date(data.MRData.RaceTable.Races[0].date + 'T' + data.MRData.RaceTable.Races[0].time);
      const circuitName = data.MRData.RaceTable.Races[0].raceName;
      let flagcountry = data.MRData.RaceTable.Races[0].Circuit.Location.country;
      let gpFlag = document.querySelector('.flag-count-down');
      gpFlag.src = 'https://cdn.countryflags.com/thumbs/' + flagcountry.toLowerCase().replace(/ /g, '-') + '/flag-400.png';
    
      // Display the circuit name in the #circuit-name element
      document.getElementById('circuit-name1').innerHTML = circuitName;
    
      // Set up the countdown
      const countdownElement = document.getElementById('countdown');
      const now = new Date().getTime();
      const distance = nextRaceDate - now;
      const secondsRemaining = Math.floor(distance / 1000);
    
      const clock = new FlipClock(countdownElement, secondsRemaining, {
        clockFace: 'DailyCounter',
        countdown: true,
      });
    
      // Stop the countdown when the race starts
      if (distance < 0) {
        clock.stop();
        document.getElementById('count-down').innerHTML = 'The race has started!';
      }
    }
    
    // Call the startCountdown function to start the countdown
    startCountdown();
        
      

  }