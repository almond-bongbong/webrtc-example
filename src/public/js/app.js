const socket = io();

const myFace = document.getElementById('myFace');
const muteButton = document.getElementById('mute');
const cameraButton = document.getElementById('camera');

let myStream;
let muted = false;
let cameraOff = false;

async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    console.log(myStream);
    myFace.srcObject = myStream;
  } catch (error) {
    console.error(error);
  }
}

getMedia();

function handleMuteClick() {
  if (muted) {
    muteButton.innerText = 'Mute';
    muted = false;
  } else {
    muteButton.innerText = 'Unmute';
    muted = true;
  }
}

function handleCameraClick() {
  if (cameraOff) {
    cameraButton.innerText = 'Camera Off';
    cameraOff = false;
  } else {
    cameraButton.innerText = 'Camera On';
    cameraOff = true;
  }
}

muteButton.addEventListener('click', handleMuteClick);
cameraButton.addEventListener('click', handleCameraClick);
