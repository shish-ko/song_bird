import "./style.scss";
import { birdsData as be, birdsDataEn as en } from '../data/birds.js';
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
const langBtn = document.querySelector('.quiz-addons__language');
const additionalPhotos=document.querySelector('.randomPhoto');
const birdsPhotos = document.querySelector('.randomPhoto__images');
let hiddenBird;
const rightAnswerSound = new Audio("../assets/right-answer.ogg");
const wrongAnswerSound = new Audio("../assets/wrong-answer.mp3");
const menu = document.querySelector('.menu-panel');

let isCorrectAnswer = false;
let totalScore = 0;
let currentLanguage = localStorage.getItem("songBirdLang") || "en";
let clickedBirdId = 1;

// language change start

window.addEventListener('DOMContentLoaded', () => {
  changeLanguage();
});
function birdsData() {
  return currentLanguage === "en" ? en : be;
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
  langBtn.textContent = `${langArr[currentLanguage].langBtn}`
  document.querySelectorAll('.block-title').forEach((item, i) => item.textContent = `${langArr[currentLanguage].blockTitle[i]}`);
  document.querySelectorAll('.audio__loading').forEach((item, i) => item.textContent = `${langArr[currentLanguage].loading}`);
  nextLevelBtn.textContent = `${langArr[currentLanguage].nxtLvl}`;
  document.querySelector(".description__disclaimer").textContent = `${langArr[currentLanguage].disclaimer}`;
  document.querySelector(".quiz-addons__res").textContent = `${langArr[currentLanguage].score}`;
  for (let i = 0; i < answers.length; i++) {
    answers[i].textContent = birdsData()[currentLevel][i].name;
  }
  birdDescription.textContent = birdsData()[currentLevel][clickedBirdId - 1].description;
  descriptionPlayer.head(birdsData()[currentLevel][clickedBirdId - 1].image, birdsData()[currentLevel][clickedBirdId - 1].name, birdsData()[currentLevel][clickedBirdId - 1].species);
}
langBtn.addEventListener('click', () => {

  currentLanguage === "en" ? currentLanguage = "be" : currentLanguage = "en";
  changeLanguage();
})

window.addEventListener('beforeunload', () => localStorage.setItem("songBirdLang", currentLanguage));

// language change end


// burger Menu start

menu.addEventListener('click', () => {
  menu.classList.toggle('menu-panel_active');
})

// burger Menu end



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
    currentLevel === 5 ? nextLevelBtn.textContent = `${langArr[currentLanguage].results}` : null;
    nextLevelBtn.classList.remove("quiz__next-level_blocked");
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

const birdsNames = [];
for (let i = 0; i < 6; i++) {
  for (let j = 0; j < 6; j++) {
    birdsNames.push(en[i][j].name);
  }
}
const datalist = document.createElement('datalist');
datalist.id = 'birdsList';
birdsNames.forEach(item => {
  const option = document.createElement('option');
  option.setAttribute('value', item);
  datalist.append(option);
})
document.body.append(datalist);
const searchBird = document.querySelector('.quiz-addons__birds-library');
searchBird.addEventListener('change', getBirdImages);
async function getBirdImages(event) {
  while(birdsPhotos.firstChild) birdsPhotos.firstChild.remove();
  additionalPhotos.classList.add('randomPhoto_active');
  const birdName = event.target.value;
  event.target.value = '';

  let url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${birdName}__(bird)&origin=*`;

  try {
    const img1 = new Image();
    img1.classList.add('randomPhoto__img');
    const res = await fetch(url);
    let data = await res.json();
    if (!data.query.pages[Object.keys(data.query.pages)[0]].original) {
      let url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${birdName}&origin=*`;
      const res = await fetch(url);
      data = await res.json();
    }
    img1.src = data.query.pages[Object.keys(data.query.pages)[0]].original.source;
    titlePhotos("Wikipedia photo");
    birdsPhotos.append(img1);
  } catch {
    titlePhotos("No Wikipedia photo", 'error');
  }


  let url2 = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=7f186c5d957a329557c371dc86a52bd1&tags=${birdName}bird&extras=url_m&format=json&nojsoncallback=1`
  const res2 = await fetch(url2);
  let data2 = await res2.json();

  if (data2.photos.total) {
    titlePhotos("Flickr photos");
    for (let i = 0; i < (data2.photos.total < 5 ? data2.photos.total : 5); i++) {
      const img2 = new Image();
      img2.classList.add('randomPhoto__img');
      img2.src = data2.photos.photo[i].url_m;
      birdsPhotos.append(img2);
    }
  } else {
    titlePhotos("No Flickr photos", 'error');
  }
  try {
    let url3 = `https://www.googleapis.com/customsearch/v1?key=AIzaSyD7FAQVefUhArWXMHXB8w3vlAiupj-ExIE&cx=03834bb717fd0430a&q=${birdName}%20bird&searchType=image`;
    const res3 = await fetch(url3);
    let data3 = await res3.json();
    titlePhotos("Google photos");
    let j=4;
    for (let i = 0; i < j; i++) {
      const img2 = new Image();
      img2.classList.add('randomPhoto__img');
      if(data3.items[i].link.includes('wikimedia' || 'fbsbx')){j++; continue};
      img2.src = data3.items[i].link;
      
      birdsPhotos.append(img2);
    }
  } catch (err) {
    titlePhotos("No google photos", 'error');
  }

  function titlePhotos(text) {
    const div = document.createElement('div');
    div.classList.add('randomPhoto__title');
    div.textContent = text;
    if(arguments[1]) div.classList.add('randomPhoto__title_error');
    birdsPhotos.append(div);
  }
  
}
additionalPhotos.addEventListener('click', ()=>additionalPhotos.classList.remove('randomPhoto_active'));
