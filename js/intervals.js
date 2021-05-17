function startup() {
  document.querySelectorAll('input[type=text]').forEach(inp => inp.value = getSavedValue(inp.id));
  document.querySelector(`#addKick`).addEventListener(`click`, addKick);
  document.querySelector(`#undo`).addEventListener(`click`, undoKick);
  document.querySelector(`#Share`).addEventListener(`click`, share);
  document.querySelector(`#CloudForm`).addEventListener(`keydown`, enterLogin);
  const user = document.querySelector(`#email`);
  fireBase();
  kicker();
  if (user.value.length > 25 && !user.value.includes(`@`)) {
    getData(user.value);
  }
  fireAuth();
}

const smoothDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

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
