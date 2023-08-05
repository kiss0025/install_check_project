function fetchData() {
  var temperatureUrl = "/temperature";
  var humidityUrl = "/humidity";
  var voltageUrl = "/voltage";

  function fetchData() {
    var temperatureUrl = "/temperature";
    var humidityUrl = "/humidity";
    var voltageUrl = "/voltage";

    // Fetch Temperature
    var xhrTemperature = new XMLHttpRequest();
    xhrTemperature.onreadystatechange = function () {
      if (xhrTemperature.readyState === 4) {
        if (xhrTemperature.status === 200) {
          var data = JSON.parse(xhrTemperature.responseText);
          document.getElementById("temperature").textContent =
            data.temperature + " °C";
        } else {
          console.error(
            "Error fetching temperature:",
            xhrTemperature.statusText
          );
        }
      }
    };
    xhrTemperature.open("GET", temperatureUrl, true);
    xhrTemperature.send();

    // Fetch Humidity
    var xhrHumidity = new XMLHttpRequest();
    xhrHumidity.onreadystatechange = function () {
      if (xhrHumidity.readyState === 4) {
        if (xhrHumidity.status === 200) {
          var data = JSON.parse(xhrHumidity.responseText);
          document.getElementById("humidity").textContent =
            data.humidity + " %";
        } else {
          console.error("Error fetching humidity:", xhrHumidity.statusText);
        }
      }
    };
    xhrHumidity.open("GET", humidityUrl, true);
    xhrHumidity.send();

    // Fetch Voltage
    var xhrVoltage = new XMLHttpRequest();
    xhrVoltage.onreadystatechange = function () {
      if (xhrVoltage.readyState === 4) {
        if (xhrVoltage.status === 200) {
          var data = JSON.parse(xhrVoltage.responseText);
          document.getElementById("voltage").textContent = data.voltage + " V";
        } else {
          console.error("Error fetching voltage:", xhrVoltage.statusText);
        }
      }
    };
    xhrVoltage.open("GET", voltageUrl, true);
    xhrVoltage.send();
  }

  window.onload = fetchData;
  setInterval(fetchData, 3000); // Refresh data every 3 seconds
}
