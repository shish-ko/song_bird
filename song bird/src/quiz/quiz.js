import "./style.scss";
import birdsData from '../data/birds.js';
import Player from '../data/player.js';
import unknownBird from '../assets/template/unknown-bird.jpg';


let currentLevel = -1;
const descriptionPlayer = new Player(document.querySelector('.description__audio'));
const mainPlayer = new Player(document.querySelector('.audio'));
const answers = document.querySelectorAll('.answers__answer');
const nextLevelBtn = document.querySelector('.quiz__next-level');
const answersBlock = document.querySelector('.answers');
const shownScore = document.querySelector('.quiz__score');
const birdTypes = document.querySelector(".quiz__bird-types");
const birdDescription=document.querySelector('.description__text');
const descriptionDisclaimer=document.querySelector('.description__disclaimer');
let hiddenBird;
const rightAnswerSound= new Audio("../assets/right-answer.ogg");
const wrongAnswerSound= new Audio("../assets/wrong-answer.mp3");

let isCorrectAnswer = false;
let totalScore = 0;


function setNewLevel() {
  currentLevel += 1;
  isCorrectAnswer = false;
  nextLevelBtn.classList.add("quiz__next-level_blocked");
  hiddenBird = birdsData[currentLevel][Math.floor(Math.random() * 6)];
  mainPlayer.src = hiddenBird.audio;
  birdTypes.children[currentLevel].classList.add("quiz__bird-type_current");
  nextLevelBtn.removeEventListener("click", setNewLevel);
  mainPlayer.head(unknownBird, "*****");
  for (let i = 0; i < answersBlock.children.length; i++) {
    answersBlock.children[i].firstElementChild.className = "answer__color";
    delete answersBlock.children[i].quiz;
  }
  for (let i = 0; i < answers.length; i++) {
    answers[i].textContent = birdsData[currentLevel][i].name;
  }
  descriptionDisclaimer.hidden=false;
  descriptionPlayer.hidden(true);
  birdDescription.hidden=true;
}
setNewLevel();

answersBlock.addEventListener('click', clickAnswer);
function clickAnswer(event) {
  descriptionDisclaimer.hidden=true;
  descriptionPlayer.hidden(false);
  birdDescription.hidden=false;
  const birdId = Array.from(answersBlock.children).indexOf(event.target.closest('li')) + 1;
  descriptionPlayer.src = birdsData[currentLevel][birdId - 1].audio;
  descriptionPlayer.head(birdsData[currentLevel][birdId - 1].image, birdsData[currentLevel][birdId - 1].name, birdsData[currentLevel][birdId - 1].species);
  birdDescription.textContent=birdsData[currentLevel][birdId - 1].description;
  if (birdId === hiddenBird.id && !isCorrectAnswer) {
    nextLevelBtn.classList.remove("quiz__next-level_blocked")
    mainPlayer.audio.pause()
    rightAnswerSound.play();
    mainPlayer.head(hiddenBird.image, hiddenBird.name);   
    isCorrectAnswer = true;
    event.target.closest('li').firstElementChild.classList.add('answer__color_right');
    nextLevelBtn.addEventListener("click", setNewLevel);
    let levelScore = 6;
    for (let i = 0; i < answersBlock.children.length; i++) {
      if (answersBlock.children[i].hasOwnProperty("quiz")) levelScore -= 1;
    }
    totalScore += levelScore;
    shownScore.textContent = totalScore;
  } else {
    if (!isCorrectAnswer) {
      wrongAnswerSound.currentTime=0;
      wrongAnswerSound.play();
      event.target.closest('li').firstElementChild.classList.add('answer__color_wrong');
      event.target.closest('li').quiz = "checked";
    }
  }
}
