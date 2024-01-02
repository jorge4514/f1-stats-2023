getResults();
    async function getResults() {
      await fetch('https://ergast.com/api/f1/current/last/results.json')
        .then(response => response.json())
        .then(data => {
          let img = document.createElement('img');
          img.src = 'https://cdn.countryflags.com/thumbs/' + data.MRData.RaceTable.Races[0].Circuit.Location.country.toLowerCase().replace(/ /g, '-') + '/flag-400.png';
          const title = data.MRData.RaceTable.Races[0].raceName;
          let title_document = document.getElementById('stats-title');
          title_document.innerHTML = 'Diferencia media por vuelta ' + title + ' ';
          img.classList.add('country-image');
          title_document.appendChild(img);
          const results = data.MRData.RaceTable.Races[0].Results;
          const labels = results.map(result => result.Driver.familyName);
          const times = results.map(result => {
            if (result.Time && result.Time.time) {
              const time = result.Time.time;
              if (time.includes(':')) {
                const [minutes, seconds] = time.split(':').map(parseFloat);
                return minutes * 60 + seconds;
              } else {
                return parseFloat(time);
              }
            } else {
              return 0;
            }
          });
          times[0] = 0;
          const laps = results.map(result => parseInt(result.laps));
          const timePerLap = times.map((time, index) => time / laps[index]);

          const teamColors = colors();
          const backgroundColors = results.map(result => {
            const teamName = result.Constructor.name.toLowerCase().replace(' ', '_');
            const teamColor = teamColors.find(color => color.team === teamName);
            return teamColor ? teamColor.color : 'rgba(0, 0, 0, 0.1)';
          });

          const ctx = document.getElementById('chart1').getContext('2d');
          const chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: 'Tiempo por vuelta media',
                data: timePerLap,
                backgroundColor: backgroundColors,
                borderColor: 'black',
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
          });
        });
    }

    function colors() {
      let colors = [
        {
          "team": "mercedes",
          "color": "#00D2BE"
        },
        {
          "team": "ferrari",
          "color": "#DC0000"
        },
        {
          "team": "red_bull",
          "color": "#0600EF"
        },
        {
          "team": "alpine",
          "color": "#0090FF"
        },
        {
          "team": "haas",
          "color": "rgb(194 194 194)"
        },
        {
          "team": "aston_martin",
          "color": "#006F62"
        },
        {
          "team": "alphatauri",
          "color": "#2B4562"
        },
        {
          "team": "mclaren",
          "color": "#FF8700"
        },
        {
          "team": "alfa",
          "color": "#900000"
        },
        {
          "team": "williams",
          "color": "#005AFF"
        }
      ];
      return colors;
    }