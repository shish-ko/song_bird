// import "./style.scss"
import birdsData from '../data/birds.js';
let currentLevel = -1;
import Player from '../data/player.js';


const answers = document.querySelectorAll('.answers__answer');
const descriptionPlayer = document.querySelector('.description__audio');
const mainPlayer=document.querySelector('.audio')
const nextLevelBtn = document.querySelector('.quiz__next-level');
const answersBlock = document.querySelector('.answers');
const shownScore = document.querySelector('.quiz__score');
const birdTypes = document.querySelector(".quiz__bird-types")
let hiddenBird

let isCorrectAnswer = false;
let totalScore = 0;



function durationConverter(ms) {
  const ceil = Math.ceil(ms)
  const minutes = String(Math.floor(ceil / 60)).padStart(2, '0')
  const seconds = String(ceil % 60).padStart(2, '0')
  return minutes + ':' + seconds
}

const players={
  audio: new Audio(),
  description__audio: new Audio()
};

function loadAudio(player, bird) {
  const loadingMessage = player.querySelector('.audio__loading');
  const controls = player.querySelector('.audio__controls');
  controls.innerHTML= '<div class="audio__play-pause"></div><div class="audio__track"><div class="audio__play-time"></div><div class="audio__time"><span class="audio__current-time">00:00</span> / <span class="audio__total-time">00:00</span></div></div>'
  const playBtn = player.querySelector('.audio__play-pause');
  const quizAudioDurationTime = player.querySelector('.audio__total-time');
  const quizAudioCurrentTime = player.querySelector('.audio__current-time');
  const quizTrack = player.querySelector('.audio__track');
  const quizTrackCurrent = player.querySelector('.audio__play-time');
  
  controls.hidden = true;
  loadingMessage.hidden = false;
  

  players[player.className].src = bird.audio;
  console.log(players)
  let isQuizAudioPlay = false;
  players[player.className].addEventListener('loadedmetadata', () => {
    quizAudioDurationTime.textContent = durationConverter(players[player.className].duration);
    quizAudioCurrentTime.textContent = "00:00";
  });
  players[player.className].addEventListener('canplaythrough', () => {controls.hidden = false; loadingMessage.hidden = true })

  playBtn.addEventListener('click', () => {
    playBtn.classList.toggle('audio__play-pause_pause');
    if (isQuizAudioPlay) {
      isQuizAudioPlay = false;
      players[player.className].pause();
    } else {
      isQuizAudioPlay = true;
      players[player.className].play();
      showCurrentTrackTime();
    }
  })
  function showCurrentTrackTime() {
    quizTrackCurrent.style.width = `${quizTrack.clientWidth / players[player.className].duration * players[player.className].currentTime}px`
    if (isQuizAudioPlay) {
      quizAudioCurrentTime.textContent = durationConverter(players[player.className].currentTime);
      setTimeout(() => {
        showCurrentTrackTime();
      }, 1000);
    }
  }
  players[player.className].onended = () => {
    showCurrentTrackTime();
    isQuizAudioPlay = false;
    playBtn.classList.remove('audio__play-pause_pause');
  };
}
function setNewLevel() {
  currentLevel += 1;  
  isCorrectAnswer = false;
  hiddenBird = birdsData[currentLevel][Math.floor(Math.random() * 6)];
  loadAudio(mainPlayer, hiddenBird)
  birdTypes.children[currentLevel].classList.add("quiz__bird-type_current");
  nextLevelBtn.removeEventListener("click", setNewLevel);
  // document.querySelector('.audio__bird-name').textContent = "*****";
  // document.querySelector('.audio__bird-pic').src = "../assets/img/unknown-bird.jpg";
  for (let i = 0; i < answersBlock.children.length; i++) {
    answersBlock.children[i].firstElementChild.className = "answer__color";
    delete answersBlock.children[i].quiz
  }
  for (let i = 0; i < answers.length; i++) {
    answers[i].textContent = birdsData[currentLevel][i].name
  }
}
setNewLevel();

answersBlock.addEventListener('click', clickAnswer);
function clickAnswer(event) {

  const birdId = Array.from(answersBlock.children).indexOf(event.target.closest('li')) + 1
  loadAudio(descriptionPlayer, birdsData[currentLevel][birdId-1])
  if (birdId === hiddenBird.id) {
    document.querySelector('.audio__bird-name').textContent = hiddenBird.name;
    document.querySelector('.audio__bird-pic').src = hiddenBird.image;
    document.querySelector('.audio__bird-pic').addEventListener("error", () => document.querySelector('.audio__bird-pic').src = "../assets/img/error-bird.png")
    isCorrectAnswer = true;
    event.target.closest('li').firstElementChild.classList.add('answer__color_right');
    nextLevelBtn.addEventListener("click", setNewLevel);
    let levelScore = 6
    for (let i = 0; i < answersBlock.children.length; i++) {
      if (answersBlock.children[i].hasOwnProperty("quiz")) levelScore -= 1;
    }
    totalScore += levelScore;
    shownScore.textContent = totalScore;
  } else {
    if (!isCorrectAnswer) {
      event.target.closest('li').firstElementChild.classList.add('answer__color_wrong');
      event.target.closest('li').quiz = "checked";
    }
  }
}

// const qqq=document.createElement('img')
// qqq.src="https://apod.nasa.gov/apod/image/9712/orionfull_jcc_big.jpg"
// qqq.onload=()=>document.querySelector('.audio__bird-pic').src="https://apod.nasa.gov/apod/image/9712/orionfull_jcc_big.jpg"