function startup() {
  document.querySelectorAll('input').forEach(inp => inp.value = getSavedValue(inp.id));
  document.querySelector(`#Save`).addEventListener(`click`, save);
  document.querySelector(`#Edit`).addEventListener(`click`, edit);
  document.querySelector(`#Start`).addEventListener(`click`, start);
  document.querySelector(`#Pause`).addEventListener(`click`, pause);
  document.querySelector(`#Reset`).addEventListener(`click`, reset);
  const num = document.querySelector(`#NumIntervals`);
  num.addEventListener(`keyup`, () => addInputs(num));
  addInputs(num);
  getSavedValue(`savedInterval`) === `true` ? save() : edit();
}

function addInputs(e) {
  saveValue(e);
  const intForm = document.querySelector(`#IntervalTimers`);
  const labForm = document.querySelector(`#IntervalLabels`);
  intForm.innerHTML = ``;
  labForm.innerHTML = ``;
  const num = +e.value || 1;
  for (let i = 0; i < num; i++) {
    let inp = document.createElement(`input`);
    let lab = document.createElement(`input`);
    inp.type = `time`;
    lab.type = `text`;
    inp.id = `interval${i}`;
    lab.id = `intervalLab${i}`;
    inp.value = getSavedValue(`interval${i}`) || `00:00`;
    lab.value = getSavedValue(`intervalLab${i}`);
    intForm.appendChild(inp);
    labForm.appendChild(lab);
  }
}

function save() {
  document.querySelectorAll('input').forEach(inp => saveValue(inp));
  document.querySelector(`#InputSelection`).style = `display:none`;
  document.querySelector(`#Intervals`).style = `display:block`;
  localStorage.setItem(`savedInterval`, true);
}

function edit() {
  document.querySelector(`#InputSelection`).style = `display:block`;
  document.querySelector(`#Intervals`).style = `display:none`;
  localStorage.setItem(`savedInterval`, false);
}

const toSecs = (text) => {
  let split = text.split(`:`);
  return +split[0] * 60 + +split[1];
}

const secs2Text = (time) => time > 60 ? `${Math.floor(time / 60)}:${secDec(time)}` : `${secDec(time)}`;
const secDec = (time) => time % 60 === 0 && time > 0 ? `00` : time % 60;

function start() {
  document.querySelector(`#Start`).style = `display:none`;
  document.querySelector(`#Pause`).style = `display:block`;
  const num = +getSavedValue(`NumIntervals`);
  let interArr = [];
  for (let i = 0; i < num; i++) {
    interArr[i] = { label: getSavedValue(`intervalLab${i}`), time: getSavedValue(`interval${i}`) }
  }
  let ind = 0;
  let time = toSecs(interArr[ind].time);
  window[`paused`] = false;
  window[`x`] = setInterval(() => {
    let label = interArr[ind].label;
    document.querySelector(`#Timer`).innerText = secs2Text(time);
    document.querySelector(`#IntervalLabel`).innerText = label;
    time = paused ? time : time += -1;
    if (time < 0) {
      ind++;
      if (ind === num) return reset();
      time = toSecs(interArr[ind].time);
    }
  }, 1000);
}

function pause() {
  let pause = document.querySelector(`#Pause`);
  window[`paused`] = paused ? false : true;
  pause.innerText = paused ? `Resume` : `Pause`;
}

function reset() {
  document.querySelector(`#Start`).style = `display:block`;
  document.querySelector(`#Pause`).style = `display:none`;
  document.querySelector(`#Timer`).innerText = `0`;
  document.querySelector(`#IntervalLabel`).innerText = `Press Start`;
  clearInterval(x);
}

async function share() {
  let dbName = firebase.auth().currentUser.uid;
  let link = `${window.location.protocol}//${window.location.host + window.location.pathname}?email=${dbName}`;
  const shareData = {
    title: `Intervals`,
    text: `Simple Intervals App`,
    url: link
  };
  sendData();
  try {
    await navigator.share(shareData);
  } catch (err) {
    console.log(`Error: ${err}`);
  }
}

function fader() {
  _(`#logInfo`).fade(`in`, 200);
  setTimeout(function () {
    _(`#logInfo`).fade(`out`, 500);
    return false;
  }, 3000);
}

function timeString(time) {
  let sec = Math.floor(time / 1000);
  let min = Math.floor(sec / 60);
  let h = Math.floor(min / 60);
  let days = Math.floor(h / 24);

  let string = days >= 1 ? `${days} days ${h % 24} h ${min % 60} mins`
    : h >= 1 ? ` ${h} h ${min % 60} mins`
      : min >= 1 ? `${min} mins`
        : `${sec}s`;
  return string;
}

startup();
