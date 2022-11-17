import "./style.scss";
import {birdsData as be, birdsDataEn as en} from '../data/birds.js';
import Player from '../data/player.js';
import unknownBird from '../assets/template/unknown-bird.jpg';
import langArr from '../data/language.js';


let currentLevel = -1;
const descriptionPlayer = new Player(document.querySelector('.description__audio'));
const mainPlayer = new Player(document.querySelector('.audio'));
const answers = document.querySelectorAll('.answers__answer');
const nextLevelBtn = document.querySelector('.quiz__next-level');
const answersBlock = document.querySelector('.answers');
const shownScore = document.querySelector('.quiz__score');
const birdTypes = document.querySelector(".quiz__bird-types");
const birdDescription = document.querySelector('.description__text');
const descriptionDisclaimer = document.querySelector('.description__disclaimer');
const langBtn=document.querySelector('.quiz-addons__language');
let hiddenBird;
const rightAnswerSound = new Audio("../assets/right-answer.ogg");
const wrongAnswerSound = new Audio("../assets/wrong-answer.mp3");
const menu = document.querySelector('.menu-panel');

let isCorrectAnswer = false;
let totalScore = 0;
let currentLanguage=localStorage.getItem("songBirdLang") || "en";
let clickedBirdId=1;

// language change start

window.addEventListener('DOMContentLoaded', () => {
  changeLanguage();
});
function birdsData(){
 return currentLanguage==="en" ?  en : be;
}

function changeLanguage() {

  const menuItems = document.querySelectorAll('.menu__link');
  for (let i = 0; i < menuItems.length; i++) {
    menuItems[i].textContent = `${langArr[currentLanguage].menu[i]}`
  }
  const birdTypes = document.querySelectorAll('.quiz__bird-type');
  for (let i = 0; i < birdTypes.length; i++) {
    birdTypes[i].textContent = `${langArr[currentLanguage].birdTypes[i]}`
  }
  langBtn.textContent=`${langArr[currentLanguage].langBtn}`
  document.querySelectorAll('.block-title').forEach((item, i)=> item.textContent=`${langArr[currentLanguage].blockTitle[i]}`);
  document.querySelectorAll('.audio__loading').forEach((item, i)=> item.textContent=`${langArr[currentLanguage].loading}`);
  nextLevelBtn.textContent=`${langArr[currentLanguage].nxtLvl}`;
  document.querySelector(".description__disclaimer").textContent=`${langArr[currentLanguage].disclaimer}`;
  document.querySelector(".quiz-addons__res").textContent=`${langArr[currentLanguage].score}`;
  for (let i = 0; i < answers.length; i++) {
    answers[i].textContent = birdsData()[currentLevel][i].name;
  }
  birdDescription.textContent = birdsData()[currentLevel][clickedBirdId - 1].description;
  descriptionPlayer.head(birdsData()[currentLevel][clickedBirdId - 1].image, birdsData()[currentLevel][clickedBirdId - 1].name, birdsData()[currentLevel][clickedBirdId - 1].species);
}
langBtn.addEventListener('click', ()=>{
  
  currentLanguage==="en" ? currentLanguage="be" : currentLanguage="en";
  changeLanguage();
})

window.addEventListener('beforeunload', ()=>localStorage.setItem("songBirdLang", currentLanguage))

// language change end


// burger Menu start

menu.addEventListener('click', () => {
  menu.classList.toggle('menu-panel_active');
})

// burger Menu end

// volume bar appearance
// volumeIcon.addEventListener('hover', ()=>document.querySelector('.audio__volume-block').classList.)


function setNewLevel() {
  currentLevel += 1;
  if (currentLevel === 6) {
    const result = {
      time: new Date(),
      result: totalScore
    }
    if (localStorage.birdSongBestResults) {
      const birdSongBestResults = JSON.parse(localStorage.getItem('birdSongBestResults'));
      birdSongBestResults.push(result);
      localStorage.setItem('birdSongBestResults', JSON.stringify(birdSongBestResults));
    } else {
      console.log(result)
      const birdSongBestResults = [];
      birdSongBestResults.push(result)
      localStorage.setItem('birdSongBestResults', JSON.stringify(birdSongBestResults));
    }
    window.location.href = "../top-results/top-res.html";
    return;
  }
  isCorrectAnswer = false;
  nextLevelBtn.classList.add("quiz__next-level_blocked");
  hiddenBird = birdsData()[currentLevel][Math.floor(Math.random() * 6)];
  mainPlayer.src = hiddenBird.audio;
  document.querySelectorAll('.quiz__bird-type').forEach(item => item.classList.remove('quiz__bird-type_current'));
  birdTypes.children[currentLevel].classList.add("quiz__bird-type_current");
  nextLevelBtn.removeEventListener("click", setNewLevel);
  mainPlayer.head(unknownBird, "*****");
  for (let i = 0; i < answersBlock.children.length; i++) {
    answersBlock.children[i].firstElementChild.className = "answer__color";
    delete answersBlock.children[i].quiz;
  }
  for (let i = 0; i < answers.length; i++) {
    answers[i].textContent = birdsData()[currentLevel][i].name;
  }
  descriptionDisclaimer.hidden = false;
  descriptionPlayer.hidden(true);
  birdDescription.hidden = true;
}
setNewLevel();

answersBlock.addEventListener('click', clickAnswer);
function clickAnswer(event) {
  descriptionDisclaimer.hidden = true;
  descriptionPlayer.hidden(false);
  birdDescription.hidden = false;
  clickedBirdId = Array.from(answersBlock.children).indexOf(event.target.closest('li')) + 1;
  descriptionPlayer.src = birdsData()[currentLevel][clickedBirdId - 1].audio;
  descriptionPlayer.head(birdsData()[currentLevel][clickedBirdId - 1].image, birdsData()[currentLevel][clickedBirdId - 1].name, birdsData()[currentLevel][clickedBirdId - 1].species);
  birdDescription.textContent = birdsData()[currentLevel][clickedBirdId - 1].description;
  if (clickedBirdId === hiddenBird.id && !isCorrectAnswer) {
    currentLevel === 5 ? nextLevelBtn.textContent =`${langArr[currentLanguage].results}` : null;
    nextLevelBtn.classList.remove("quiz__next-level_blocked")
    mainPlayer.audio.pause();
    wrongAnswerSound.currentTime = 0;
    wrongAnswerSound.pause();
    rightAnswerSound.play();
    mainPlayer.head(hiddenBird.image, hiddenBird.name);
    isCorrectAnswer = true;
    event.target.closest('li').firstElementChild.classList.add('answer__color_right');
    nextLevelBtn.addEventListener("click", setNewLevel);
    let levelScore = 5;
    for (let i = 0; i < answersBlock.children.length; i++) {
      if (answersBlock.children[i].hasOwnProperty("quiz")) levelScore -= 1;
    }
    totalScore += levelScore;
    shownScore.textContent = totalScore;
  } else {
    if (!isCorrectAnswer) {
      wrongAnswerSound.currentTime = 0;
      wrongAnswerSound.play();
      event.target.closest('li').firstElementChild.classList.add('answer__color_wrong');
      event.target.closest('li').quiz = "checked";
    }
  }
}

