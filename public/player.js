let buttons = document.querySelectorAll(".button");
let player = document.querySelector(".player");
let playbutton = document.getElementById("playbutton");
let playerAudio = document.querySelector("audio");
let seekbar = document.querySelector("#seekbar");
let timekeeper = document.querySelector(".timekeeper");
let songName = document.querySelector(".song-name");
let songArtist = document.querySelector(".song-artist");
let songRelease = document.querySelector(".song-release-date");

footerAnim = anime.timeline();
let curSongId = null;
let firstTime = true;

const icons = {
  playCircleFilled: "&#xE038;",
  playCircleOutline: "&#xE039;",
  pauseCircleFilled: "&#xE035;",
  pauseCircleOutline: "&#xE036;"
};

buttons.forEach(e => {
  e.addEventListener("click", function(event) {
    let el = event.target.closest("div");
    let lastStopped = null;

    toggle();

    if (curSongId != el.id && playerAudio.paused) {
      console.log("[Starting] Song ID did not match.");
      if (firstTime === true) {
        firstTime = false;
        footerAnim
        .add({
          targets: "#footercontainer",
          easing: "easeOutQuint",
          opacity: 0,
          duration: 800
        })
        .add({
          targets: ".player",
          opacity: 1,
          easing: "easeOutQuint",
          duration: 800,
          offset: "-=400"
        });
      }
      curSongId = el.id;
      playerAudio.src = el.dataset.url;
      playerAudio.onloadeddata = function() {
        playerAudio.play();
        setSongInfo(el);
      };
      playerAudio.load();

      el.firstChild.innerHTML = icons.pauseCircleFilled;
    } else if (curSongId == el.id && !playerAudio.paused) {
      console.log("[Pausing] Song ID matched.");
      playerAudio.pause();
      el.firstChild.innerHTML = icons.playCircleFilled;
    } else if (curSongId == el.id && playerAudio.paused) {
      console.log("[Resuming] Song ID matched.");
      playerAudio.play();
      el.firstChild.innerHTML = icons.pauseCircleFilled;
    } else {
      console.log("[Switching] Song ID did not match.");
      playerAudio.pause();
      playerAudio.src = el.dataset.url;
      playerAudio.onloadeddata = function() {
        playerAudio.play();
        document.getElementById(curSongId).firstChild.innerHTML =
          icons.playCircleFilled;
        curSongId = el.id;
        el.firstChild.innerHTML = icons.pauseCircleFilled;
        setSongInfo(el);
      };
      playerAudio.load();
      toggle();
    }
  });
});

playbutton.addEventListener("click", (event) => {
  if (playerAudio.paused) {
    console.log("[Playing] Big button pressed");
    event.target.closest("i").innerHTML = icons.pauseCircleOutline;
    document.getElementById(curSongId).firstChild.innerHTML = icons.pauseCircleFilled;
    playerAudio.play();
  } else {
    console.log("[Pausing] Big button pressed");
    event.target.closest("i").innerHTML = icons.playCircleOutline;
    document.getElementById(curSongId).firstChild.innerHTML = icons.playCircleFilled;
    playerAudio.pause();
  }
});

seekbar.addEventListener("input", (event) => {
  if (!playerAudio.pause) playerAudio.pause();
  if (playerAudio.duration) playerAudio.currentTime = playerAudio.duration * event.target.value;
});

seekbar.addEventListener("dragend", (event) => {
  if (playerAudio.paused) playerAudio.play();
});

setInterval(() => {
  if (playerAudio && playerAudio.currentTime && playerAudio.duration) {
    seekbar.value = playerAudio.currentTime / playerAudio.duration;
    timekeeper.firstChild.innerHTML = formatMinuteSecond(playerAudio.currentTime);
    timekeeper.lastChild.innerHTML = formatMinuteSecond(playerAudio.duration);
  }
}, 60);

function animRotate(element, turns, duration = 500) {
  return anime.timeline({autoplay: false}).add({
    targets: element,
    easing: "easeOutQuint",
    rotate: turns + "turn",
    duration: duration,
    direction: "normal"
  });
}

function toggle() {
  playbutton.innerHTML = playerAudio.paused ? icons.pauseCircleOutline : icons.playCircleOutline;
}

function setSongInfo(element) {
  songArtist.innerHTML = element.dataset.artistName;
  songName.innerHTML = element.dataset.title;
  songRelease.innerHTML = element.dataset.releaseDate;
}

function toMinFromSec(value) {
  return Math.floor(value / 60);
}

function getRemainingSec(value) {
  return Math.floor(value % 60);
}

function formatSeconds(value) {
  if (value > 9) {
    return value;
  } else {
    return "0" + value.toString();
  }
}

function formatMinuteSecond(value) {
  return (
    formatSeconds(toMinFromSec(value)) +
    ":" +
    formatSeconds(getRemainingSec(value))
  );
}
