// import "./style.scss"
import birdsData from '../data/birds.js';
let currentLevel = -1;
// function getRandomBird() {
//   return birdsData[currentLevel][Math.floor(Math.random() * 6)]
// }

const answers = document.querySelectorAll('.answers__answer');
const player = document.querySelector('.audio__controls');
const loadingMessage = document.querySelector('.audio__loading');
const playBtn = document.querySelector('.audio__play-pause');
const quizAudioDurationTime = document.querySelector('.audio__total-time');
const quizAudioCurrentTime = document.querySelector('.audio__current-time');
const quizTrack = document.querySelector('.audio__track');
const quizTrackCurrent = document.querySelector('.audio__play-time');
const nextLevelBtn = document.querySelector('.quiz__next-level');
const answersBlock = document.querySelector('.answers');
const shownScore=document.querySelector('.quiz__score');
const birdTypes=document.querySelector(".quiz__bird-types")
let hiddenBird
const quizAudio = new Audio();
let isQuizAudioPlay = false;
let isCorrectAnswer = false;
let totalScore=0;


playBtn.addEventListener('click', () => { 
  playBtn.classList.toggle('audio__play-pause_pause');
  if (isQuizAudioPlay) {
    isQuizAudioPlay = false;
    quizAudio.pause();
  } else {
    isQuizAudioPlay = true;
    quizAudio.play();
    showCurrentTrackTime();
  }
})

quizAudio.onended = () => {
  showCurrentTrackTime();
  isQuizAudioPlay = false;
  playBtn.classList.remove('audio__play-pause_pause');
};
function durationConverter(ms) {
  const ceil = Math.ceil(ms)
  const minutes = String(Math.floor(ceil / 60)).padStart(2, '0')
  const seconds = String(ceil % 60).padStart(2, '0')
  return minutes + ':' + seconds
}
function showCurrentTrackTime() {
  quizTrackCurrent.style.width = `${quizTrack.clientWidth / quizAudio.duration * quizAudio.currentTime}px`
  if (isQuizAudioPlay) {
    quizAudioCurrentTime.textContent = durationConverter(quizAudio.currentTime);
    setTimeout(() => {
      showCurrentTrackTime();
    }, 1000);
  }
}
function loadAudio(player, bird){
  
}
function setNewLevel() {
  currentLevel += 1;
  player.hidden = true;
  loadingMessage.hidden = false;
  isCorrectAnswer = false;
  isQuizAudioPlay = false;
  playBtn.classList.remove('audio__play-pause_pause');
  
  birdTypes.children[currentLevel].classList.add("quiz__bird-type_current");
  nextLevelBtn.removeEventListener("click", setNewLevel);
  document.querySelector('.audio__bird-name').textContent = "*****";
  document.querySelector('.audio__bird-pic').src = "../assets/img/unknown-bird.jpg";
  for (let i = 0; i < answersBlock.children.length; i++) {
    answersBlock.children[i].firstElementChild.className = "answer__color";
    delete answersBlock.children[i].quiz
  }
  for (let i = 0; i < answers.length; i++) {
    answers[i].textContent = birdsData[currentLevel][i].name
  }
  hiddenBird = birdsData[currentLevel][Math.floor(Math.random() * 6)];
  console.time('qwe')
  quizAudio.src = hiddenBird.audio;
  quizAudio.addEventListener('loadedmetadata', () => {
    quizAudioDurationTime.textContent = durationConverter(quizAudio.duration);
    quizAudioCurrentTime.textContent ="00:00";
  })

  quizAudio.addEventListener('canplaythrough', () => { console.timeEnd('qwe'); player.hidden = false; loadingMessage.hidden = true })
}
setNewLevel();

answersBlock.addEventListener('click', clickAnswer);
function clickAnswer(event) {
  const birdId = Array.from(answersBlock.children).indexOf(event.target.closest('li')) + 1
  if (birdId === hiddenBird.id) {
    document.querySelector('.audio__bird-name').textContent = hiddenBird.name;
    document.querySelector('.audio__bird-pic').src = hiddenBird.image;
    document.querySelector('.audio__bird-pic').addEventListener("error", ()=>document.querySelector('.audio__bird-pic').src= "../assets/img/error-bird.png")
    isCorrectAnswer = true;
    event.target.closest('li').firstElementChild.classList.add('answer__color_right');
    nextLevelBtn.addEventListener("click", setNewLevel);
    let levelScore=6
    for(let i=0; i<answersBlock.children.length; i++){
      if(answersBlock.children[i].hasOwnProperty("quiz")) levelScore-=1;
    }
    totalScore+=levelScore;
    shownScore.textContent=totalScore;
  } else {
    if (!isCorrectAnswer) {
      event.target.closest('li').firstElementChild.classList.add('answer__color_wrong');
      event.target.closest('li').quiz="checked";
    }
  }
}

// const qqq=document.createElement('img')
// qqq.src="https://apod.nasa.gov/apod/image/9712/orionfull_jcc_big.jpg"
// qqq.onload=()=>document.querySelector('.audio__bird-pic').src="https://apod.nasa.gov/apod/image/9712/orionfull_jcc_big.jpg"