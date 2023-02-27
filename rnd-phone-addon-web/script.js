function redSliderChange() {
  let redSlider = document.getElementById('red');
  document.getElementById('redValue').innerHTML = '<p>' + redSlider.value + '</p>';
  document.getElementById('rgbVisualizer').style.backgroundColor = getRGBSliderValues();
}

function greenSliderChange() {
  let greenSlider = document.getElementById('green');
  document.getElementById('greenValue').innerHTML = '<p>' + greenSlider.value + '</p>';
  document.getElementById('rgbVisualizer').style.backgroundColor = getRGBSliderValues();
}

function blueSliderChange() {
  let blueSlider = document.getElementById('blue');
  document.getElementById('blueValue').innerHTML = '<p>' + blueSlider.value + '</p>';
  document.getElementById('rgbVisualizer').style.backgroundColor = getRGBSliderValues();
}

function getRGBSliderValues() {
  let red = document.getElementById('red').value;
  let green = document.getElementById('green').value;
  let blue = document.getElementById('blue').value;
  return 'rgb(' + red + ',' + green + ',' + blue + ')';
}

(function() {
    'use strict';
  
    document.addEventListener('DOMContentLoaded', event => {
      let connectButton = document.querySelector("#connect");
      let statusDisplay = document.querySelector('#status');
      let rgbSensorDiv = document.getElementById('rgb sensor');
      let submitButton = document.getElementById('submit button');
      let redSlider = document.getElementById('red');
      let greenSlider = document.getElementById('green');
      let blueSlider = document.getElementById('blue');
      let port;
  
      function connect() {
        port.connect().then(() => {
          statusDisplay.textContent = '';
          connectButton.textContent = 'Disconnect';
  
          port.onReceive = data => {
            let textDecoder = new TextDecoder();
            let arduinoResult = textDecoder.decode(data).toString();
            let arduinoResultArray = arduinoResult.split('-');
            if (arduinoResultArray.length == 4) {
              console.log(arduinoResultArray);
              let red = arduinoResultArray[0];
              let green = arduinoResultArray[1];
              let blue = arduinoResultArray[2];
              let button = parseInt(arduinoResultArray[3]);
              let sensorRGB = 'R: ' + red + ' B: ' + blue + ' G: ' + green;
              if (button == 0) {
                rgbSensorDiv.style.backgroundColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
                rgbSensorDiv.innerHTML = '<h2>' + sensorRGB + '</h2>';
              } else {
                let newDiv = document.createElement('div');
                document.getElementById('color parent').prepend(newDiv);
                newDiv.style.left = "auto";
                newDiv.style.position = "relative";
                newDiv.style.backgroundColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
                newDiv.innerHTML = '<h2>' + sensorRGB + '</h2>';
              }
            }          
          }
          port.onReceiveError = error => {
            console.error(error);
          };
        }, error => {
          statusDisplay.textContent = error;
        });
      } 

      submitButton.addEventListener('click', function() {
        let red = redSlider.value;
        let green = greenSlider.value;
        let blue = blueSlider.value;
        let userRGB = 'R: ' + red + ' B: ' + blue + ' G: ' + green;

        let newDiv = document.createElement('div');
        document.getElementById('color parent').prepend(newDiv);
        newDiv.style.left = "auto";
        newDiv.style.position = "relative";
        newDiv.style.backgroundColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
        newDiv.innerHTML = '<h2>' + userRGB + '</h2>';
      });
  
      connectButton.addEventListener('click', function() {
        if (port) {
          port.disconnect();
          connectButton.textContent = 'Connect';
          statusDisplay.textContent = '';
          port = null;
        } else {
          serial.requestPort().then(selectedPort => {
            port = selectedPort;
            connect();
          }).catch(error => {
            statusDisplay.textContent = error;
          });
        }
      });
  
      serial.getPorts().then(ports => {
        if (ports.length == 0) {
          statusDisplay.textContent = 'No device found.';
        } else {
          statusDisplay.textContent = 'Connecting...';
          port = ports[0];
          connect();
        }
      });
    });
  })();