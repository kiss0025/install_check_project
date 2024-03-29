window.onload = function () {
  "use strict";
  var paths = document.getElementsByTagName("path");
  var visualizer = document.getElementById("visualizer");
  var mask = visualizer.getElementById("mask");
  btn_noise3sec;
  var h = document.getElementsByTagName("h1")[0]; // 중간 db값
  var hSub = document.getElementsByTagName("h1")[1]; // db값 아래 사운드불량 표시
  var preObject = document.getElementById("object"); //SNR

  var ngbtn = document.getElementById("btn-ng");
  var okbtn = document.getElementById("btn-ok");
  var noise_btn = document.getElementById("btn_noise3sec");

  var AudioContext;
  var audioContent;
  var start = false;
  var permission = false;
  var noise_count = false;
  var path;
  var seconds = 0;
  var noise_count = 0;
  var loud_volume_threshold = 70;
  var volume_A = 10; // 이하 불량치
  var volume_B = 30;
  var volume_C = 50;

  var soundAllowed = function (stream) {
    permission = true;
    var audioStream = audioContent.createMediaStreamSource(stream);
    var analyser = audioContent.createAnalyser();
    var fftSize = 1024;

    analyser.fftSize = fftSize;
    audioStream.connect(analyser);

    var bufferLength = analyser.frequencyBinCount;
    var frequencyArray = new Uint8Array(bufferLength);

    visualizer.setAttribute("viewBox", "0 0 255 255");

    for (var i = 0; i < 255; i++) {
      path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("stroke-dasharray", "4,1");
      mask.appendChild(path);
    }
    var doDraw = function () {
      requestAnimationFrame(doDraw);
      if (start) {
        analyser.getByteFrequencyData(frequencyArray);
        var adjustedLength;
        for (var i = 0; i < 255; i++) {
          adjustedLength =
            Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
          paths[i].setAttribute("d", "M " + i + ",255 l 0,-" + adjustedLength);
        }
      } else {
        for (var i = 0; i < 255; i++) {
          paths[i].setAttribute("d", "M " + i + ",255 l 0,-" + 0);
        }
      }
    };
    var showVolume = function () {
      setTimeout(showVolume, 500);
      if (start) {
        analyser.getByteFrequencyData(frequencyArray);
        var total = 0;
        for (var i = 0; i < 255; i++) {
          var x = frequencyArray[i];
          total += x * x;
        }
        var rms = Math.sqrt(total / bufferLength);
        var db = 20 * (Math.log(rms) / Math.log(10));
        db = Math.max(db, 0); // sanity check
        h.innerHTML = Math.floor(db) + " dB";

        /* SNR (dB) = 10 * Log (Signal_Power / Noise_Power) 
                만일, 비교하는 신호와 잡음의 단위가 Power 가 아니라 전압이라면
                10 대신 20을 곱. 그 이유는 단위 저항에 대한 전력이 전압의 제곱으로
                표현 되기 때문 */
        var Noise_power = 0.2;
        const snr = 10 * Math.log10(db / Noise_power);
        const formattedSNR = `SNR : ${snr.toFixed(2)} dB`;
        const formattedData3 = `${formattedSNR}`;
        const formattedHTML3 = formattedData3.replace(/\n/g, "<br>");

        preObject.innerHTML = formattedHTML3;

        /*if (db >= loud_volume_threshold) {
                    seconds += 0.5;
                    if (seconds >= 5) {
                        hSub.innerHTML = "You’ve been in loud environment for<span> " + Math.floor(seconds) + " </span>seconds." ;
                    }
                }*/
        if (db <= volume_B) {
          seconds += 0.5;
          if (seconds >= 3) {
            hSub.innerHTML =
              "사운드 불량<span> " + Math.floor(seconds) + " </span>seconds.";
            ngbtn.innerHTML = "불량";
            ngbtn.style.backgroundColor = "red";
          }
        } else {
          seconds = 0;
          hSub.innerHTML = "";
          ngbtn.innerHTML = "정상";
          ngbtn.style.backgroundColor = "green";
        }
      } else {
        h.innerHTML = "";
        hSub.innerHTML = "";
      }
    };

    doDraw();
    showVolume();
  };

  var soundNotAllowed = function (error) {
    h.innerHTML = "You must allow your microphone.";
    console.log(error);
  };

  // 3초간 측정 추가 시작
  var noiseAllowed = function (stream) {
    permission = true;
    var audioStream = audioContent.createMediaStreamSource(stream);
    var analyser = audioContent.createAnalyser();
    var fftSize = 1024;

    analyser.fftSize = fftSize;
    audioStream.connect(analyser);

    var bufferLength = analyser.frequencyBinCount;
    var frequencyArray = new Uint8Array(bufferLength);

    visualizer.setAttribute("viewBox", "0 0 255 255");

    for (var i = 0; i < 255; i++) {
      path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("stroke-dasharray", "4,1");
      mask.appendChild(path);
    }
    var doDraw = function () {
      requestAnimationFrame(doDraw);
      if (start) {
        analyser.getByteFrequencyData(frequencyArray);
        var adjustedLength;
        for (var i = 0; i < 255; i++) {
          adjustedLength =
            Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
          paths[i].setAttribute("d", "M " + i + ",255 l 0,-" + adjustedLength);
        }
      } else {
        for (var i = 0; i < 255; i++) {
          paths[i].setAttribute("d", "M " + i + ",255 l 0,-" + 0);
        }
      }
    };
    var showVolume = function () {
      setTimeout(showVolume, 500);
      if (start) {
        analyser.getByteFrequencyData(frequencyArray);
        var total = 0;
        for (var i = 0; i < 255; i++) {
          var x = frequencyArray[i];
          total += x * x;
        }
        var rms = Math.sqrt(total / bufferLength);
        var db = 20 * (Math.log(rms) / Math.log(10));
        db = Math.max(db, 0); // sanity check
        h.innerHTML = Math.floor(db) + " dB";

        /* SNR (dB) = 10 * Log (Signal_Power / Noise_Power) 
                만일, 비교하는 신호와 잡음의 단위가 Power 가 아니라 전압이라면
                10 대신 20을 곱. 그 이유는 단위 저항에 대한 전력이 전압의 제곱으로
                표현 되기 때문 */

        var Noise_power = 0.2;
        const snr = 10 * Math.log10(db / Noise_power);
        const formattedSNR = `SNR : ${snr.toFixed(2)} dB`;
        const formattedData3 = `${formattedSNR}`;
        const formattedHTML3 = formattedData3.replace(/\n/g, "<br>");

        preObject.innerHTML = formattedHTML3;

        /*if (db >= loud_volume_threshold) {
                    seconds += 0.5;
                    if (seconds >= 5) {
                        hSub.innerHTML = "You’ve been in loud environment for<span> " + Math.floor(seconds) + " </span>seconds." ;
                    }
                }*/
      } else {
        h.innerHTML = "";
        hSub.innerHTML = "";
      }
    };

    doDraw();
    showVolume();
  };

  var soundNotAllowed = function (error) {
    h.innerHTML = "You must allow your microphone.";
    console.log(error);
  };
  // 3초간 측정 추가 끝

  document.getElementById("button").onclick = function () {
    if (start) {
      start = false;
      this.innerHTML = "<span class='fa fa-play'></span>Start Listen";
      this.className = "green-button";
      ngbtn.innerHTML = "";
      ngbtn.style.backgroundColor = "black";
      h.innerHTML = "시작하려면 Start 버튼을 누르세요";

      // Noise 측정 버튼 표시
      if ((noise_count = 0)) {
        document.getElementById("btn_noise3sec").style.display = "inline-block";
      }
    } else {
      if (!permission) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(soundAllowed)
          .catch(soundNotAllowed);

        AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContent = new AudioContext();
      }
      start = true;
      this.innerHTML = "<span class='fa fa-stop'></span>Stop Listen";
      this.className = "red-button";

      // Noise 측정 버튼 숨기기
      document.getElementById("btn_noise3sec").style.display = "none";
    }
  };

  // 추가 : 초기 3초간 Noise 측정
  document.getElementById("btn_noise3sec").onclick = function () {
    if (start) {
      start = false;
      this.innerHTML = "Noise 측정";
      this.className = "red-button";
      ngbtn.innerHTML = "";
      ngbtn.style.backgroundColor = "black";
    } else {
      if (!permission) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(noiseAllowed)
          .catch(soundNotAllowed);
        AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContent = new AudioContext();
      }
      start = true;
      //this.innerHTML = "<span class='fa fa-stop'></span>Stop";
      //this.className = "red-button";

      // 여기에 카운트 다운 시작 함수 호출
      startCountdown();
    }
  };

  function startCountdown() {
    let count = 3;
    hSub.innerHTML = count + " sec";
    noise_btn.innerHTML = count + " sec";
    let countdownInterval = setInterval(function () {
      count--;
      hSub.innerHTML = count + " sec";
      noise_btn.innerHTML = count + " sec";

      if (count <= 0) {
        clearInterval(countdownInterval);
        hSub.innerHTML = "";

        // Noise 측정 버튼 숨기기
        document.getElementById("btn_noise3sec").style.display = "none";
        noise_count = 1;
        start = false;
        preObject.innerHTML = "Start 버튼을 누르세요";
        // Noise 측정 버튼 다시 표시
        //document.getElementById("btn_noise3sec").style.display = "inline-block";
      }
    }, 1000);
  }
};
