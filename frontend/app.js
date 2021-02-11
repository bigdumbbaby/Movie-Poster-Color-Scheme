import ColorThief from './node_modules/colorthief/dist/color-thief.mjs'
const colorThief = new ColorThief();
fetch('http://localhost:3000/movies/')
  .then(response => response.json())
  .then(movies => getAllMovies(movies.results))

  function getAllMovies(movies){
    movies.forEach(movie => displayPosters(movie))
  }

  function displayPosters(movie){
    const $image = document.createElement('img') 
    const $div = document.createElement('div') 
    const $textDiv = document.createElement('div')
    const $title = document.createElement('h2')
    const $overview = document.createElement('p')
    const $rating = document.createElement('p')

    $div.className = "movie-card"
    $textDiv.className = "movie-text"

    $div.id = movie.id
    $title.textContent = movie.title
    $overview.textContent = movie.overview


    
    const avgRating = findAverageRating(movie.vote_average)
    const starRating = getStarRating(avgRating)
    

    $rating.textContent = "Rating: " + starRating + " (" +  movie.vote_average + ")"

    $image.className = "poster"
    $image.src = "https://image.tmdb.org/t/p/w200" + movie.poster_path

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
    document.body.append($div)
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