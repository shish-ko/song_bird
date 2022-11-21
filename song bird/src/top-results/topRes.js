import "./styles.scss";
import langArr from '../data/language.js';
import {BirdSearch} from "../data/birdSearch.js";

const result=document.querySelector('.result');
const tryAgainButton=document.querySelector('.result__try-again');
const congratulation=document.querySelector('.result__congratulation');
const menu=document.querySelector('.menu-panel');
const langBtn=document.querySelector('.quiz-addons__language');


let currentLanguage=localStorage.getItem("songBirdLang") || "en";
let isResultsShown=false

function changeLanguage() {
  if(isResultsShown) result.lastChild.remove()
  const menuItems = document.querySelectorAll('.menu__link');
  for (let i = 0; i < menuItems.length; i++) {
    menuItems[i].textContent = `${langArr[currentLanguage].menu[i]}`
  }
  langBtn.textContent=`${langArr[currentLanguage].langBtn}`  
 
  document.querySelector(".result__congratulation").textContent=`${langArr[currentLanguage].congrats}`;
  document.querySelector(".result__info").textContent=`${langArr[currentLanguage].result}`;
  document.querySelector(".result__try-again").textContent=`${langArr[currentLanguage].tryAgain}`;
  showResults();
}
langBtn.addEventListener('click', ()=>{  
  currentLanguage==="en" ? currentLanguage="be" : currentLanguage="en";
  changeLanguage();
})
console.log(result.hasChildNodes('ul.top-results'))
function showResults(){
  if(localStorage.getItem('birdSongBestResults')){
    isResultsShown=true
    const bestResults=JSON.parse(localStorage.getItem('birdSongBestResults'));
    if(bestResults.length>10){
      bestResults.splice(0, bestResults.length-10);
    }
    const bestResList=document.createElement('ul');
    bestResList.classList.add('top-results');
    for(let i=bestResults.length-1; i>=0; i--){
      const li=document.createElement('li');
      li.classList.add('top-results__item');
      const date=document.createElement('span');
      date.classList.add('top-results__date');
      date.textContent=`${langArr[currentLanguage].data} ${bestResults[i].time.slice(0, 10)}, `;
      li.append(date);
      const score=document.createElement('span');
      score.classList.add('top-results__score');
      score.textContent=`${langArr[currentLanguage].score} ${bestResults[i].result}`;
      li.append(score);
      bestResList.append(li);
    }
    result.append(bestResList);
    if(bestResults[bestResults.length-1].result===30){
      tryAgainButton.hidden=true;
      congratulation.hidden=false;
    }
  }else{
    const div=document.createElement('div');
    div.classList.add('result__congratulation');
    div.textContent=`${langArr[currentLanguage].noRes}`;
    result.insertAdjacentElement('beforeend', div);
  }
}

menu.addEventListener('click', ()=>{
  menu.classList.toggle('menu-panel_active');
});
window.addEventListener('DOMContentLoaded', () => {
  changeLanguage();
});
window.addEventListener('beforeunload', ()=>localStorage.setItem("songBirdLang", currentLanguage))

document.querySelector(".result__try-again").addEventListener('click', ()=>window.location='./quiz.html');

//settig search for additional photos

const getAdditionPhotos=new BirdSearch(document.body);
getAdditionPhotos.setDatalist();

// language change start