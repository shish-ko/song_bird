import { birdsDataEn as en } from "./birds.js";


class BirdSearch {
  constructor() {
    this.additionalPhotos = document.querySelector('.randomPhoto');
    this.birdsPhotos = document.querySelector('.randomPhoto__images');
    this.searchBird = document.querySelector('.quiz-addons__birds-library');
    this.searchBird.addEventListener('change', (event)=>this.getBirdImages(event));
    this.additionalPhotos.addEventListener('click', () => this.additionalPhotos.classList.remove('randomPhoto_active'));    
  }
  setDatalist() {
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
  }
  async getBirdImages(event) {
    while (this.birdsPhotos.firstChild) this.birdsPhotos.firstChild.remove();
    this.additionalPhotos.classList.add('randomPhoto_active');
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
      this.titlePhotos("Wikipedia photo");
      this.birdsPhotos.append(img1);
    } catch {
      this.titlePhotos("No Wikipedia photo", 'error');
    }
  
    let url2 = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.FLICKR_KEY}&tags=${birdName}bird&extras=url_m&format=json&nojsoncallback=1`
    const res2 = await fetch(url2);
    let data2 = await res2.json();
  
    if (data2.photos.total) {
      this.titlePhotos("Flickr photos");
      for (let i = 0; i < (data2.photos.total < 5 ? data2.photos.total : 5); i++) {
        const img2 = new Image();
        img2.classList.add('randomPhoto__img');
        img2.src = data2.photos.photo[i].url_m;
        this.birdsPhotos.append(img2);
      }
    } else {
      this.titlePhotos("No Flickr photos", 'error');
    }
    try {
      let url3 = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_KEY}&cx=03834bb717fd0430a&q=${birdName}%20bird&searchType=image`;
      const res3 = await fetch(url3);
      let data3 = await res3.json();
      this.titlePhotos("Google photos");
      let j = 4;
      for (let i = 0; i < j; i++) {
        const img2 = new Image();
        img2.classList.add('randomPhoto__img');
        if (data3.items[i].link.includes('wikimedia' || 'fbsbx')) { j++; continue };
        img2.src = data3.items[i].link;
  
        this.birdsPhotos.append(img2);
      }
    } catch (err) {
      this.titlePhotos("No google photos", 'error');
    }    
  }

  titlePhotos(text) {
    const div = document.createElement('div');
    div.classList.add('randomPhoto__title');
    div.textContent = text;
    if (arguments[1]) div.classList.add('randomPhoto__title_error');
    this.birdsPhotos.append(div);
  }
}


export { BirdSearch }