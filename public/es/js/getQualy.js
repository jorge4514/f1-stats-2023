
getQualy();

function convertToSeconds(time) {
    const parts = time.split(':');
    const minutes = parseInt(parts[0], 10);
    const seconds = parseFloat(parts[1]);
    return (minutes * 60) + seconds;
}

async function getQualy() {
    const response = await fetch('https://ergast.com/api/f1/current/last/qualifying.json');
    const data = await response.json();

    let img = document.createElement('img');
    img.src = 'https://cdn.countryflags.com/thumbs/' + data.MRData.RaceTable.Races[0].Circuit.Location.country.toLowerCase().replace(/ /g, '-') + '/flag-400.png';
    const title = data.MRData.RaceTable.Races[0].raceName;
    let title_document = document.getElementById('stats-title2');
    title_document.innerHTML = 'Diferencias: Qualy ' + title + ' ';
    img.classList.add('country-image');
    title_document.appendChild(img);


    const drivers = data.MRData.RaceTable.Races[0].QualifyingResults;
    const times = drivers.map(driver => driver.Q3 || driver.Q2 || driver.Q1).map(convertToSeconds);
    const firstTime = times[0];
    const differences = times.map(time => time - firstTime);

    const teamColors = colors();
          const backgroundColors = drivers.map(result => {
            const teamName = result.Constructor.name.toLowerCase().replace(' ', '_');
            const teamColor = teamColors.find(color => color.team === teamName);
            return teamColor ? teamColor.color : 'rgba(0, 0, 0, 0.1)';
          });

    const ctx = document.getElementById('chart2').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: drivers.map(driver => driver.Driver.familyName),
            datasets: [{
                label: 'Time Differences',
                data: differences,
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
}







function colors() {
    let colors = [
        {
            "team": "mercedes",
            "color": "#6CD3BF"
        },
        {
            "team": "ferrari",
            "color": "#F91536"
        },
        {
            "team": "red_bull",
            "color": "#3671C6"
        },
        {
            "team": "alpine",
            "color": "#2293D1"
        },
        {
            "team": "haas",
            "color": "#B6BABD"
        },
        {
            "team": "aston_martin",
            "color": "#358C75"
        },
        {
            "team": "alphatauri",
            "color": "#5E8FAA"
        },
        {
            "team": "mclaren",
            "color": "#FF8700"
        },
        {
            "team": "alfa",
            "color": "#C92D4B"
        },
        {
            "team": "williams",
            "color": "#37BEDD"
        }
    ];
    return colors;
}