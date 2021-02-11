import ColorThief from './node_modules/colorthief/dist/color-thief.mjs'
const colorThief = new ColorThief();

const $movieSection = document.querySelector('#movie-section')
const $pageForward = document.querySelector('#page-forward')
const $pageBack = document.querySelector('#page-back')
$pageForward.addEventListener('click', pageForward)
$pageBack.addEventListener('click', pageBack)

let pageNumber = 1;
function fetchMovies(){
  fetch(`http://localhost:3000/movies?page=${pageNumber}`)
    .then(response => response.json())
    .then(movies => getAllMovies(movies.results))
}
fetchMovies()

function getAllMovies(movies){
  $movieSection.innerHTML = ''
  movies.forEach(movie => displayPosters(movie))
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
  $image.src = "https://image.tmdb.org/t/p/w200" + movie.poster_path

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
      var thergb = "rgb(" + colors[0] + "," + colors[1] + "," + colors[2] + ")"; 
      $div.style.backgroundColor = thergb
    } else {
      $image.addEventListener('load', () => {
        colorThief.getColor($image);
        const colors = colorThief.getColor($image)
        const colorPalattes = colorThief.getPalette($image, 7)
        displayColorPalette(colorPalattes, $textDiv, $image)
        var thergb = "rgb(" + colors[0] + "," + colors[1] + "," + colors[2] + ")"; 
        $div.style.backgroundColor = thergb
      });
    }
  } else {
    const $palettedDiv = document.getElementById(`image-link: ${$image.src}`)
    $palettedDiv.remove()
    $div.style.backgroundColor = ''
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

function pageForward(event, searchName){
  pageNumber = pageNumber + 1;
  fetchMovies()
}
function pageBack(event, searchName){
  pageNumber = pageNumber - 1;
  fetchMovies()
}