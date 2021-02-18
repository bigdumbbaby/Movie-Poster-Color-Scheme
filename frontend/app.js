import ColorThief from './node_modules/colorthief/dist/color-thief.mjs'
const colorThief = new ColorThief();

let pageNumber = 1;

const $movieSection = document.querySelector('#movie-section')
const $pageForward = document.querySelector('#page-forward')
const $pageBack = document.querySelector('#page-back')
const $upcomingButton = document.querySelector('#upcoming-button')
const $nowPlayingButton = document.querySelector('#now-playing-button')
const $topRatedButton = document.querySelector('#top-rated-button')
const $footer = document.querySelector('#footer')

$pageForward.addEventListener('click', pageForward)
$pageBack.addEventListener('click', pageBack)
$upcomingButton.addEventListener('click', fetchUpcoming)
$nowPlayingButton.addEventListener('click', fetchNowPlaying)
$topRatedButton.addEventListener('click', fetchTopRated)

function fetchUpcoming(){
  pageNumber = 1;
  localStorage.setItem('filter', 'upcoming')
  fetchMovies('upcoming')
}
function fetchNowPlaying(){
  pageNumber = 1;
  localStorage.setItem('filter', 'now_playing')
  fetchMovies('now_playing')
}
function fetchTopRated(){
  pageNumber = 1;
  localStorage.setItem('filter', 'top_rated')
  fetchMovies('top_rated')
}


function fetchMovies(filter){
  fetch(`http://localhost:3000/movies?page=${pageNumber}&filter=${filter}`)
    .then(response => response.json())
    .then(movies => getAllMovies(movies, filter))
}
if($movieSection.innerHTML === ''){
  localStorage.setItem('filter', 'upcoming')
  fetchMovies('now_playing')
}

function getAllMovies(movies, filter){
  $movieSection.innerHTML = ''
  const $filterTitle = document.createElement('h1')
  $filterTitle.className = 'filter-title'
  if(filter === 'upcoming'){
    $filterTitle.textContent = 'Upcoming'
  }
  if(filter === 'now_playing'){
    $filterTitle.textContent = 'Now Playing'
  }
  if(filter === 'top_rated'){
    $filterTitle.textContent = 'Top Rated'
  }
  
  $movieSection.append($filterTitle)
  movies.results.forEach(movie => displayPosters(movie))
  addFooter(movies)
}

function displayPosters(movie){
  const $image = document.createElement('img') 
  const $div = document.createElement('div') 
  const $textDiv = document.createElement('div')
  const $colorPaletteDiv = document.createElement('div')
  const $title = document.createElement('h2')
  const $overview = document.createElement('p')
  const $rating = document.createElement('p')
  const $showPaletteButton = document.createElement('button')

  $div.className = "movie-card"
  $textDiv.className = "movie-text"
  $showPaletteButton.className = "show-palette-button"
  $showPaletteButton.innerText = "Show Palette"

  $div.id = movie.id
  $title.textContent = movie.title
  $overview.textContent = movie.overview
  
  const avgRating = findAverageRating(movie.vote_average)
  const starRating = getStarRating(avgRating)
  
  $rating.textContent = "Rating: " + starRating + " (" +  movie.vote_average + ")"
  $image.className = "poster"

  if(movie.poster_path === null){
    $image.src = './images/default_poster.jpg'
  } else {
    $image.src = "https://image.tmdb.org/t/p/w300" + movie.poster_path
  }

  $showPaletteButton.addEventListener('click', (event) => mainColor(event, $textDiv, $div, $image))
  

  $textDiv.prepend($title, $overview, $rating, $showPaletteButton)
  $div.append($textDiv, $image)
  $movieSection.append($div)
}

function mainColor(event, $textDiv, $div, $image){
  $image.crossOrigin="Anonymous"
  if($div.style.backgroundColor === ''){
    if ($image.complete) {
      const colors = colorThief.getColor($image)
      const colorPalettes = colorThief.getPalette($image, 7)
      displayColorPalette(colorPalettes, $textDiv, $image)
      // var thergb = "rgb(" + colors[0] + "," + colors[1] + "," + colors[2] + ")"; 
      // $div.style.backgroundColor = thergb
      checkBrightness(colors, $div)
    } else {
      $image.addEventListener('load', () => {
        colorThief.getColor($image);
        const colors = colorThief.getColor($image)
        const colorPalattes = colorThief.getPalette($image, 7)
        displayColorPalette(colorPalattes, $textDiv, $image)
        // var thergb = "rgb(" + colors[0] + "," + colors[1] + "," + colors[2] + ")"; 
        // $div.style.backgroundColor = thergb
        checkBrightness(colors, $div)
      });
    }
  } else {
    const $palettedDiv = document.getElementById(`image-link: ${$image.src}`)
    $palettedDiv.remove()
    $div.style.backgroundColor = ''
    $div.style.color = 'black'
  }
}

function displayColorPalette(colorPalettes, $textDiv, $image){
  const $paletteDiv = document.createElement('div')
  $paletteDiv.id = 'image-link: ' + $image.src
  const $paletteHeader = document.createElement('h4')
  $paletteHeader.innerText = "Palette:"
  $paletteDiv.append($paletteHeader)
  colorPalettes.forEach(palatte => {
    const $paletteSpan = document.createElement('span')
    $paletteSpan.className = 'dot'
    var thergb = "rgb(" + palatte[0] + "," + palatte[1] + "," + palatte[2] + ")"; 
    $paletteSpan.style.backgroundColor = thergb

    $paletteDiv.append($paletteSpan)
  })
  $textDiv.append($paletteDiv)
}

function findAverageRating(num){
  return Math.round(num/2)
}

function getStarRating(num){
  let starRating = ""
  switch (num) {
    case 0:
      starRating = "☆☆☆☆☆";
      break;
    case 1:
      starRating = "★☆☆☆☆";
      break;
    case 2:
      starRating = "★★☆☆☆";
      break;
    case 3:
      starRating = "★★★☆☆";
      break;
    case 4:
      starRating = "★★★★☆";
      break;
    case 5:
      starRating = "★★★★★";
      break;
  }
  return starRating
}

function pageForward(){
  pageNumber = pageNumber + 1;
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
  
  fetchMovies(localStorage.filter)
}

function pageBack(){
  pageNumber = pageNumber - 1;
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
  fetchMovies(localStorage.filter)
}

function checkBrightness(colorArray, $div){
  const thergb = "rgb(" + colorArray[0] + "," + colorArray[1] + "," + colorArray[2] + ")"; 
  $div.style.backgroundColor = thergb
  const brightness = Math.round(((parseInt(colorArray[0]) * 299) + (parseInt(colorArray[1]) * 587) + (parseInt(colorArray[2]) * 114)) / 1000)
  if(brightness < 150){
    $div.style.color = "white"
  } else {
    $div.style.color = "black"
  }
}

function addFooter(movies){
  console.log(movies.total_pages)
  const $pageNumberIndicator  = document.querySelector('#page-number-indicator')
  $pageNumberIndicator.textContent = pageNumber
  if(pageNumber === 1){
    $pageBack.style.display = "none"
  } if(pageNumber === movies.total_pages) {
    $pageForward.style.display = "none"
  }
  else{
    $pageBack.style.display = "block"
    $pageForward.style.display = "block"
  }
}
