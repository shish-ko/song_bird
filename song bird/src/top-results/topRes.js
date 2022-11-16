import "./styles.scss";

const result=document.querySelector('.result');
const tryAgainButton=document.querySelector('.result__try-again');
const congratulation=document.querySelector('.result__congratulation');
const menu=document.querySelector('.menu-panel');


function showResults(){
  if(localStorage.key('birdSongBestResults')){
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
      date.textContent=`Дата: ${bestResults[i].time.slice(0, 10)}, `;
      li.append(date);
      const score=document.createElement('span');
      score.classList.add('top-results__score');
      score.textContent=`очки: ${bestResults[i].result}`;
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
    div.textContent='Пока нет ни одного результата.';
    result.insertAdjacentElement('beforeend', div);
  }
}
showResults();

menu.addEventListener('click', ()=>{
  menu.classList.toggle('menu-panel_active');
})