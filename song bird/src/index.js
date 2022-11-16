import "./style.scss"
import bgvideo from "./assets/video/HD.mp4";

const menu=document.querySelector(".menu__nav");
menu.addEventListener("click", ()=>menu.classList.toggle('menu__nav_active'));
