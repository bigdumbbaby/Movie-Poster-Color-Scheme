import ColorThief from './node_modules/colorthief/dist/color-thief.mjs'
const colorThief = new ColorThief();

const $movieSection = document.querySelector('#movie-section')
const $nameSearch = document.querySelector('#name-search')
const $pageForward = document.querySelector('#page-forward')
const $pageBack = document.querySelector('#page-back')

$nameSearch.addEventListener('submit', findMovies)
let pageNumber = 1;

function findMovies(event){
  event.preventDefault()
  const nameSearchFormData = new FormData(event.target)
  const searchName = nameSearchFormData.get('movie-name')
  pageNumber = 1
  $pageForward.addEventListener('click', event => pageForward(event, searchName))
  $pageBack.addEventListener('click', event => pageBack(event, searchName))
  fetchSearchedMovies(searchName)
}

function fetchSearchedMovies(searchName){
  console.log(pageNumber)
  fetch(`http://localhost:3000/search?movie_name=${searchName}&page=${pageNumber}`)
    .then(response => response.json())
    .then(movies => getAllMovies(movies.results))
}

function getAllMovies(movies){
  $movieSection.innerHTML = ''
  movies.forEach(movie => displayPosters(movie))
}

function displayPosters(movie){
  const $image = document.createElement('img') 
  const $div = document.createElement('div') 
  const $textDiv = document.createElement('div')
  const $title = document.createElement('h2')
  const $overview = document.createElement('p')
  const $rating = document.createElement('p')

  console.log(movie)
  $div.className = "movie-card"
  $textDiv.className = "movie-text"

  $div.id = movie.id
  $title.textContent = movie.title
  $overview.textContent = movie.overview

  const avgRating = findAverageRating(movie.vote_average)
  const starRating = getStarRating(avgRating)
  

  $rating.textContent = "Rating: " + starRating + " (" +  movie.vote_average + ")"

  $image.className = "poster"
  $image.src = "https://image.tmdb.org/t/p/w300" + movie.poster_path

  $image.crossOrigin="Anonymous"
  if ($image.complete) {
    const colors = colorThief.getColor($image)
    var thergb = "rgb(" + colors[0] + "," + colors[1] + "," + colors[2] + ")"; 
    $div.style.backgroundColor = thergb
  } else {
    $image.addEventListener('load', () => {
      colorThief.getColor($image);
      const colors = colorThief.getColor($image)
      var thergb = "rgb(" + colors[0] + "," + colors[1] + "," + colors[2] + ")"; 
      $div.style.backgroundColor = thergb
    });
  }
  $textDiv.append($title, $overview, $rating)
  $div.append($textDiv, $image)
  $movieSection.append($div)
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
  fetchSearchedMovies(searchName)
}
function pageBack(event, searchName){
  pageNumber = pageNumber - 1;
  fetchSearchedMovies(searchName)
}