let songs = [];
let currsong = new Audio();
let playBtn = document.querySelector("#play");
let folder;
const defaultFolder = "songs/default"; 

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
function playnpause() {
  if (currsong.paused) {
    currsong.play();
    playBtn.src = "pics/pause.svg"; // Change button to pause icon
  } else {
    currsong.pause();
    playBtn.src = "pics/play.svg"; // Change button to play icon
  }
}
const playmusic = (track, pause = false) => {
  currsong.src = `/${folder}/` + track;
  if (!pause) {
    currsong.play();
    playBtn.src = "pics/pause.svg";
  }
  document.querySelector(".duration").innerHTML = "00:00:00";
  document.querySelector(".sname").innerHTML = decodeURI(track);
  // document.querySelector(".sname").innerHTML=track.split("_")[0];
};


async function getsong(currfolder){
  if(currfolder==="songs/default")
  {  }
  else
  {
    document.querySelector(".pp").innerHTML="Albums Songs";
    document.querySelector(".add").style.display="none" ;
  }
    folder=currfolder
    songs = [];
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
  let res = await a.text();
  let div = document.createElement("div");
  div.innerHTML = res;
  let as = div.getElementsByTagName("a");

  for (let i = 0; i < as.length; i++) {
    let element = as[i];
    if (element.href.endsWith(".mp3")) {
      //     let s= element.href.split("songs/")[1]
      //   songs.push(s.split("_")[0]);
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  playmusic(songs[0], true);

  let songUl = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
    songUl.innerHTML = " ";
  for (let song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li><div class="infoo">
     <img class="upimg " width="34" src="pics/music.svg" alt="">
                           
                       <div class="info"><div> ${song.replaceAll(
                         "%20",
                         " "
                       )}</div>
                          </div> </div>
                           <div class="playnow">
                               <img class="upimg2" src="pics/play2.svg" alt="">
                           </div> </li>`;
  }
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  // Attach event listener to the button
  playBtn.addEventListener("click", playnpause);

  currsong.addEventListener("timeupdate", () => {
    console.log(currsong.currentTime, currsong.duration);
    document.querySelector(".duration").innerHTML = `${secondsToMinutesSeconds(
      currsong.currentTime
    )} /${secondsToMinutesSeconds(currsong.duration)} `;
    document.querySelector(".circle").style.left =
      (currsong.currentTime / currsong.duration) * 100 + "%";
  });
  // Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currsong.currentTime = (currsong.duration * percent) / 100;
  });
  //adding event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".leftmain").style.left = "0";
    document.querySelector(".cross").style.display = "inline";
  });
  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".leftmain").style.left = "-130%";
  });

  //ADDING EVENT LISTENER for previous
  document.querySelector("#prev").addEventListener("click", () => {
    let index = songs.indexOf(currsong.src.split(`/${folder}/`)[1]);
    console.log(index);
    if (index > 0) {
      playmusic(songs[index - 1]);
    } else {
      playmusic(songs[songs.length - 1]);
    }
  });
  //ADDING EVENT LISTENER for next
  document.querySelector("#next").addEventListener("click", () => {
    let index = songs.indexOf(currsong.src.split(`/${folder}/`)[1]);
    console.log(index);
    if (index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    } else {
      playmusic(songs[0]);
    }
  });

  // Adding event  for volume
  document.querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log(e.target.value)
      currsong.volume=e.target.value/100
    });
// load the playlist card is picked
return songs;
}
async function displayalbums()
{
  getsong("songs/default")
Array.from(document.querySelectorAll(".box")).forEach((e)=>{
  console.log("Fetching Songs")
  e.addEventListener("click", async item => {
    console.log("Fetching Songs")
    songs = await getsong(`songs/${item.currentTarget.dataset.currfolder}`)  
    playmusic(songs[0]);

})
})
}
displayalbums();
// getsong("songs/default");
