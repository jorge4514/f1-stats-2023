async function get_time_since_last_win_or_podium(driver_id) {
  const url = `https://ergast.com/api/f1/drivers/${driver_id}/results.json?limit=1000`;
  const response = await fetch(url);
  const data = await response.json();
  const races = data.MRData.RaceTable.Races;
  let last_win_date = null;
  let last_podium_date = null;

  for (let race of races) {
    if (race.Results[0].position === "1") {
      last_win_date = new Date(race.date);
    } else if (["2", "3"].includes(race.Results[0].position)) {
      const podium_date = new Date(race.date);
      if (last_podium_date === null || podium_date > last_podium_date) {
        last_podium_date = podium_date;
      }
    }
  }

  const time_since_last_win = last_win_date ? (new Date() - last_win_date) / (1000 * 60 * 60 * 24) : null;
  const time_since_last_podium = last_podium_date ? (new Date() - last_podium_date) / (1000 * 60 * 60 * 24) : null;

  return [time_since_last_win, time_since_last_podium];
}

async function print_time_since_last_win_or_podium(driver_name, driver_id) {
  const [time_since_last_win, time_since_last_podium] = await get_time_since_last_win_or_podium(driver_id);
  const driver_name_capitalized = driver_name.charAt(0).toUpperCase() + driver_name.slice(1);
  let result = `${driver_name_capitalized} `;
  if (time_since_last_win === null && time_since_last_podium === null) {
    result += 'no tiene victorias ni podios.';
  } else {
    result += 'lleva ';
    if (time_since_last_win !== null) {
      result += `${time_since_last_win.toFixed(0)} días sin ganar una carrera`;
    }
    if (time_since_last_podium !== null) {
      if (time_since_last_win !== null) {
        result += ' y ';
      }
      result += `${time_since_last_podium.toFixed(0)} días desde su último podio.`;
    }
  }
  return result;
}




