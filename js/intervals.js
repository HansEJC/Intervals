"use strict";
function startup() {
  document.querySelectorAll('input').forEach(inp => inp.value = getSavedValue(inp.id));
  document.querySelector(`#Save`).addEventListener(`click`, save);
  document.querySelector(`#Edit`).addEventListener(`click`, edit);
  document.querySelector(`#Start`).addEventListener(`click`, start);
  document.querySelector(`#Pause`).addEventListener(`click`, pause);
  document.querySelector(`#Reset`).addEventListener(`click`, reset);
  document.querySelector(`#Share`).addEventListener(`click`, share);
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

const secs2Text = (time) => time >= 60 ? `${Math.floor(time / 60)}:${secDec(time)}` : `${secDec(time)}`;
const secDec = (time) => time % 60 < 10 && time > 0 ? `0${time % 60}` : time % 60;

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
    progress(time / toSecs(interArr[ind].time));
    time = paused ? time : time += -1;
    if (time < 0) {
      ind++;
      if (ind === num) return reset();
      time = toSecs(interArr[ind].time);
    }
  }, 1000);
}

const progress = (percent) => document.querySelector(`progress`).value = 1- percent;

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
  let link = window.location.href;
  const shareData = {
    title: `Intervals`,
    text: `Simple Intervals App`,
    url: link
  };
  try {
    await navigator.share(shareData);
  } catch (err) {
    console.log(`Error: ${err}`);
  }
}

startup();
