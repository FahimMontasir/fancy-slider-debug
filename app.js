const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];
// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';


// show images 
const showImages = (images) => {
  showSpinner()
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)

  })
}


const getImages = (query) => {
  showSpinner()
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits)) //array name spelling fixed
    .catch(err => console.log(err))
}


let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  let item = sliders.indexOf(img);
  //select and deselect
  if (item === -1) {
    element.classList.toggle('added');
    sliders.push(img);
  } else {
    element.classList.toggle('added');
    const index = sliders.indexOf(img);
    sliders.splice(index, 1);
  }
}


let timer;
const createSlider = () => {
  // check slider duration
  // const duration = document.getElementById('duration').value * 1000; converted to second
  const duration = document.getElementById('duration').value;
  if (duration < 0) {
    const warning = document.getElementById('warning');
    const warningMessage = `<h5 class ="text-center text-danger">negative duration doesn't allowed</h5>`
    warning.innerHTML = warningMessage;
    return;
  }
  // check slider image length
  if (sliders.length < 2) {
    const warning = document.getElementById('warning');
    const warningMessage = `<h5 class ="text-center text-warning">select at least two images</h5>`
    warning.innerHTML = warningMessage;
    return;
  }
  // crate slider previous next area
  document.getElementById('warning').innerHTML = '';
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;
  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';

  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">
      `;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration || 1000);
}


// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}


// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  };
  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }
  items.forEach(item => {
    item.style.display = "none";
  })
  items[index].style.display = "block";
}


//search button
searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search').value;
  //search validation added
  if (search === "") {
    const searchWarning = document.getElementById('searchWarning');
    const warningMessage = `<h5 class ="text-center text-danger">put some text on the search box</h5>`
    searchWarning.innerHTML = warningMessage;
  }
  else {
    searchWarning.innerHTML = "";
    getImages(search)
    sliders.length = 0;
  }
})


//enter key added
sliderBtn.addEventListener('click', function () {
  createSlider()
})
document.getElementById("search").addEventListener("keyup", (event) => {
  if (event.key === 'Enter') {
    document.getElementById("search-btn").click();
  }
});


//growing Spinner
const showSpinner = () => {
  const spinnerDiv = document.getElementById('growingSpinner');
  const imgDiv = document.getElementById('allImg');
  spinnerDiv.classList.toggle('d-none');
  imgDiv.classList.toggle('d-none');
}


//back to select image button
const back = () => {
  imagesArea.style.display = 'block';
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
}