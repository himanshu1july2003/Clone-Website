let songs = [];
let currsong = new Audio();
let playBtn = document.querySelector("#play");
let folder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

const playmusic = (track, pause = false) => {
  currsong.src = `/${folder}/` + track;
  if (!pause) {
    currsong.play();
    playBtn.src = "pause.svg";
  }
  document.querySelector(".duration").innerHTML = "00:00:00";
  document.querySelector(".sname").innerHTML = decodeURI(track);
};

// Play/Pause Function
function playnpause() {
  if (currsong.paused) {
    currsong.play();
    playBtn.src = "pause.svg"; // Change button to pause icon
  } else {
    currsong.pause();
    playBtn.src = "play.svg"; // Change button to play icon
  }
}

// Attach event listener once to avoid multiple bindings
playBtn.addEventListener("click", playnpause);

async function getsong(currfolder) {
  folder = currfolder;
  songs = []; // Clear the previous song queue before fetching new ones
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
  let res = await a.text();
  let div = document.createElement("div");
  div.innerHTML = res;
  let as = div.getElementsByTagName("a");

  for (let i = 0; i < as.length; i++) {
    let element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  if (songs.length > 0) {
    playmusic(songs[0], true);
  }

  let songUl = document.querySelector(".songlist ul");
  songUl.innerHTML = ""; // Clear previous songs
  for (let song of songs) {
    songUl.innerHTML += `<li>
      <div class="infoo">
        <img class="upimg" width="34" src="music.svg" alt="">
        <div class="info"><div>${song.replaceAll("%20", " ")}</div></div>
      </div>
      <div class="playnow">
        <img class="upimg2" src="play2.svg" alt="">
      </div>
    </li>`;
  }

  // Click event for song list
  document.querySelectorAll(".songlist li").forEach((e) => {
    e.addEventListener("click", () => {
      let trackName = e.querySelector(".info div").innerText.trim();
      playmusic(trackName);
    });
  });

  return songs; // Return songs to update global list
}

// Event Listeners for Audio Controls
currsong.addEventListener("timeupdate", () => {
  document.querySelector(".duration").innerHTML = `${secondsToMinutesSeconds(currsong.currentTime)} / ${secondsToMinutesSeconds(currsong.duration)}`;
  document.querySelector(".circle").style.left = (currsong.currentTime / currsong.duration) * 100 + "%";
});

document.querySelector(".seekbar").addEventListener("click", (e) => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".circle").style.left = percent + "%";
  currsong.currentTime = (currsong.duration * percent) / 100;
});

// Next and Previous Song Controls
document.querySelector("#prev").addEventListener("click", () => {
  let index = songs.indexOf(currsong.src.split(`/${folder}/`)[1]);
  if (index > 0) {
    playmusic(songs[index - 1]);
  } else {
    playmusic(songs[songs.length - 1]);
  }
});

document.querySelector("#next").addEventListener("click", () => {
  let index = songs.indexOf(currsong.src.split(`/${folder}/`)[1]);
  if (index + 1 < songs.length) {
    playmusic(songs[index + 1]);
  } else {
    playmusic(songs[0]);
  }
});

// Volume Control
document.querySelector(".range input").addEventListener("change", (e) => {
  currsong.volume = e.target.value / 100;
});

// Album Selection - Fetch and Play Songs
async function displayalbums() {
  document.querySelectorAll(".box").forEach((e) => {
    e.addEventListener("click", async (item) => {
      let folderName = item.currentTarget.dataset.currfolder;
      songs = await getsong(`songs/${folderName}`);
      if (songs.length > 0) {
        playmusic(songs[0]); // Play the first song of the new album
      }
    });
  });
}

displayalbums();
