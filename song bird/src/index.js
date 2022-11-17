import "./style.scss"
import bgvideo from "./assets/video/HD.mp4";
import langArr from './data/language.js';

const menu=document.querySelector(".menu__nav");
menu.addEventListener("click", ()=>menu.classList.toggle('menu__nav_active'));

const currentLanguage='be';

if(localStorage.songBirdLang==='be'){
  const menuItems = document.querySelectorAll('.menu__link');
  for (let i = 0; i < menuItems.length; i++) {
    menuItems[i].textContent = `${langArr[currentLanguage].menu[i]}`
  }
 
  document.querySelector('.landing__subtitle').innerHTML=`${langArr[currentLanguage].subtitle}`;
  document.querySelector('.github-account__link').textContent=`${langArr[currentLanguage].github}`;

}

document.querySelector('.rs-school').addEventListener("click", ()=>window.location='https://rs.school/js/')