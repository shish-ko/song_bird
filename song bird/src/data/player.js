class Player {
  audio = new Audio();
  that=this
  constructor(player) {
    
    this.player = player;
    this.playBtn = this.player.querySelector('.audio__play-pause');
    this.loadingMessage = this.player.querySelector('.audio__loading');
    this.controls = this.player.querySelector('.audio__controls');
    this.playBtn = this.player.querySelector('.audio__play-pause');
    this.quizAudioDurationTime = this.player.querySelector('.audio__total-time');
    this.quizAudioCurrentTime = this.player.querySelector('.audio__current-time');
    this.quizTrack = this.player.querySelector('.audio__track');
   
    this.songTitle=this.player.querySelector('.audio__bird-name');
    this.songSubtitle=this.player.querySelector('.audio__latin-bird-name');
    this.songPic=this.player.querySelector('.audio__bird-pic');
    this.volumeBlock=this.player.querySelector('.audio__volume-block');
    this.currentVolume=this.player.querySelector('.audio__volume-current');
    this.songPic.addEventListener("error", () => this.songPic.src = "../assets/error-bird.png")
    this.audio.addEventListener('canplaythrough', () => { this.controls.hidden = false; this.loadingMessage.hidden = true })
    this.audio.addEventListener('loadedmetadata', () => {
      this.quizAudioDurationTime.textContent = this.durationConverter(this.audio.duration);
      this.quizAudioCurrentTime.textContent = "00:00";
      this.showCurrentTrackTime();
    });
    this.audio.onended = () => {
      this.showCurrentTrackTime();
      this.playBtn.classList.remove('audio__play-pause_pause');
    }
    this.quizTrack.addEventListener('change', ()=>this.setCurrentTime())
    this.volumeBlock.addEventListener("click", (()=>this.setVolume()));
    this.playBtn.addEventListener('click', () => this.playPause()) // using the arrow func you prevent passing caller's 'this'. for more see: https://stackoverflow.com/questions/43727516/how-adding-event-handler-inside-a-class-with-a-class-method-as-the-callback
  }
  set src(path) {
    this.controls.hidden = true;
    this.loadingMessage.hidden = false;
    this.audio.src = path;
    this.playBtn.classList.remove('audio__play-pause_pause');
    this.audio.onloadedmetadata=()=>this.quizTrack.setAttribute('max', `${Math.ceil(this.audio.duration)}`);
  }
  durationConverter(ms) {
    const ceil = Math.ceil(ms)
    const minutes = String(Math.floor(ceil / 60)).padStart(2, '0')
    const seconds = String(ceil % 60).padStart(2, '0')
    return minutes + ':' + seconds
  }
  playPause() {
    this.playBtn.classList.toggle('audio__play-pause_pause');
    if (!this.audio.paused) {
      this.audio.pause();
    } else {
      this.audio.play();
      this.showCurrentTrackTime();
    }
  }
  showCurrentTrackTime() {
    this.quizTrack.value= `${Math.ceil(this.audio.currentTime)}`;
    
    if (!this.audio.paused) {
      this.quizAudioCurrentTime.textContent = this.durationConverter(this.audio.currentTime);
      setTimeout(() => {
        this.showCurrentTrackTime();
      }, 1000);
    }
  }
  head(pic, title, subtitle){
    this.songPic.src=pic;
    this.songTitle.textContent=title;
    if(subtitle) this.songSubtitle.textContent=subtitle;
  }
  setVolume (){
    this.audio.volume=event.offsetX/event.currentTarget.clientWidth
    this.currentVolume.style.width=`${event.offsetX}px`
  }
  hidden(arg){
    return this.player.hidden=arg
  }
  setCurrentTime(){
    this.audio.currentTime=event.target.value;
  }
}
export default Player


