let startStopBtn = document.getElementById('start-stop'),
  video = document.getElementById('video-src'),
  micEl = document.getElementById('mic'),
  btnDiv = document.getElementById('btn-div'),
  inputDivEl = document.querySelector('.input-div'),
  fileNameEl = document.getElementById('fileNameEl'),
  saveFileBtn = document.getElementById('save-file'),
  cancelBtn = document.getElementById('cancel'),
  fixedLayer = document.querySelector('.fixedLayer'),
  messageDiv = document.querySelector('.message-div'),
  recordCount = 0,
  saveBtnCount = 0,
  filename,
  recordBtn = `<iconify-icon icon="ph:record-duotone" class="icon-i"></iconify-icon>`,
  stopBtn = `<iconify-icon icon="ic:twotone-stop-circle" class="icon-i"></iconify-icon>`,
  micEnabledBtn = `<iconify-icon icon="ph:microphone-duotone" class = "icon-i"></iconify-icon>`,
  micDisabledBtn = `<iconify-icon icon="ph:microphone-slash-duotone" class = "icon-i"></iconify-icon>`,
  downloadBtn = `<iconify-icon icon="ph:download-duotone" class = "icon-i"></iconify-icon>`,
  firefoxWarningMsg = `<span class='emoji'>🫤</span> Please press the record button again...`,
  downloadLink = document.createElement('a'),
  micDecision = true,
  recordURL = `http://127.0.0.1:5500/#record`,
  browserName,
  mediaRecorder,
  stream,
  audio,
  mixedStream,
  recordedChunks = [],
  seconds = 1,
  minutes = 00,
  hours = 00,
  interval;

window.onload = () => {
  if (window.location.href == recordURL && navigator.userAgent.match(/firefox|fxios/i) === null) {
    startStopBtn.click();
  }
  if (window.location.href === recordURL && navigator.userAgent.match(/firefox|fxios/i)) {
    messageDiv.classList.add('active');
    messageDiv.innerHTML = firefoxWarningMsg;
    setTimeout(()=>{messageDiv.classList.remove('active'); setTimeout(messageP.innerHTML = '' , 2001);} , 2000);
  }
  video.removeAttribute('src');
}


startStopBtn.addEventListener('click', function () {
  if (recordCount > 1) {
    window.location.href = recordURL;
    window.location.reload();
  }

  else if (startStopBtn.innerHTML === recordBtn && recordCount === 0) {
    startFunc();
    recordCount++;
  }
  else if (startStopBtn.innerHTML === stopBtn && recordCount === 1) {
    stopFunc();
    recordCount++;
  }
  else {
    console.log("There's an error while trying to record screen");
  }
});

const startFunc = async () => {
  mixedStream = await recordScreen();
  mediaRecorder = createRecorder(mixedStream);
  video.removeAttribute('src');
  if (hours !== 00 || minutes !== 00 || seconds !== 1) {
    resetStopWatch();
    startStopWatch();
  }
  else {
    startStopWatch();
  }

  micEl.disabled = true;
  micEl.classList.remove('color-primary');
  micEl.classList.add('disabled');
  startStopBtn.innerHTML = stopBtn;
};

const stopFunc = () => {
  mixedStream.getTracks().forEach(track => track.stop());
  mediaRecorder.stop();
  stopStopWatch();
  micEl.disabled = false;
  micEl.classList.remove('disabled');
  micEl.classList.add('color-primary');
  startStopBtn.innerHTML = recordBtn;
};

async function recordScreen() {
  stream = await navigator.mediaDevices.getDisplayMedia({
    video: { mediaSource: "screen" }
  });

  if (micDecision === true) {
    audio = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        sampleRate: 44100,
      },
    });
  }
  else if (micDecision === false) {
    audio = null;
  }

  if (audio !== null) {
    return new MediaStream([...stream.getTracks(), ...audio.getTracks()]);
  }
  else {
    return new MediaStream([...stream.getTracks()]);;
  }
}

function createRecorder(mixedStream) {
  // the stream data is stored in this array

  const mediaRecorder = new MediaRecorder(mixedStream);

  mediaRecorder.ondataavailable = function (e) {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };
  mediaRecorder.onstop = function () {
    saveFile(recordedChunks);
    recordedChunks = [];
  };
  mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
  return mediaRecorder;
}

function saveFile(recordedChunks) {

  const blob = new Blob(recordedChunks, {
    type: 'video/mp4'
  });
  let blobUrl;
  blobUrl = URL.createObjectURL(blob);
  video.setAttribute('src', `${blobUrl}`);
  downloadLink.classList.add('download-link', 'icon');
  downloadLink.innerHTML = downloadBtn;

  btnDiv.appendChild(downloadLink);

  downloadLink.addEventListener('click', () => {
    fixedLayer.classList.add('active');
    inputDivEl.classList.add('active');
    saveFileBtn.addEventListener('click', () => {
      if (fileNameEl.value === '' || undefined) {
        fileNameEl.value = 'video';
      }

      if (fileNameEl.value !== '' || fileNameEl.value !== undefined) {
        filename = fileNameEl.value;
      }
      fileNameFunc();
      saveBtnCount++;
      fixedLayer.classList.remove('active');
      inputDivEl.classList.remove('active');
    })

    cancelBtn.addEventListener('click', () => {
      downloadLink.removeEventListener('click', () => {
        if (fileNameEl.value === '' || undefined) {
          fileNameEl.value = 'video';
        }

        if (fileNameEl.value !== '' || fileNameEl.value !== undefined) {
          filename = fileNameEl.value;
        }
        fileNameFunc();
        fixedLayer.classList.remove('active');
        inputDivEl.classList.remove('active');
      });

      fixedLayer.classList.remove('active');
      inputDivEl.classList.remove('active');
      filename = undefined;
      fileNameEl.value = '';
    });
  })

  const fileNameFunc = () => {
    downloadLink.href = blobUrl;
    downloadLink.download = `${filename}.mp4`;
    if(saveBtnCount === 0){
      downloadLink.click();
    }
    URL.revokeObjectURL(blob);
    btnDiv.removeChild(downloadLink);
    downloadLink.href = '';
    downloadLink.download = '';
  }

}

micEl.addEventListener('click', () => {
  if (micDecision === true) {
    micDecision = false;
    setTimeout(() => { micEl.innerHTML = micDisabledBtn });
  }
  else if (micDecision === false) {
    micDecision = true;
    setTimeout(() => { micEl.innerHTML = micEnabledBtn });
  }
  else {
    micDecision = false;
  }
});

// STOPWATCH

let minsEl = document.getElementById('mins'),
  secondsEl = document.getElementById('seconds'),
  hoursEl = document.getElementById('hours');

const startStopWatch = () => {
  interval = setInterval(stopWatch, 1000);
}

const stopWatch = () => {
  seconds++;
  if (seconds <= 9) {
    secondsEl.innerHTML = "0" + seconds;
  }
  if (seconds > 9) {
    secondsEl.innerHTML = seconds;
  }

  if (seconds > 59) {
    seconds = 00;
    secondsEl.innerHTML = "0" + seconds;
    minutes++;
  }

  if (minutes <= 9) {
    minsEl.innerHTML = "0" + minutes;
  }
  if (minutes > 9) {
    minsEl.innerHTML = minutes;
  }
  if (minutes > 59) {
    minutes = 00;
    minsEl.innerHTML = "0" + minutes;
    hours++;
  }

  if (hours <= 9) {
    hoursEl.innerHTML = "0" + hours;
  }
  if (hours > 9) {
    hoursEl.innerHTML = hours;
  }
}

const stopStopWatch = () => {
  clearInterval(interval);
}

const resetStopWatch = () => {
  stopStopWatch();
  hours = 00, minutes = 00, seconds = 1;
  hoursEl.innerHTML = "00", minsEl.innerHTML = "00", secondsEl.innerHTML = "00";
}