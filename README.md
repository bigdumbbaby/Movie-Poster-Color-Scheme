# Movie Poster Color Palette!
### Flatiron School Mod3 (Full Stack Web App)
##### Colton O'Connor (@bigdumbbaby) 

## Introduction 
The Movie Poster Color Palette app allows the user to search through a vast database of movies and show the color palette of the film's poster. This app also allows a user to upload their own photos and select the number of palettes they want to see. 

## Overview Video 

## Technologies 

1. Ruby on Rails (backend)
2. HTML/CSS/Javascript/Node.js (frontend)
3. [TheMovieDB API](https://www.themoviedb.org/)
4. ColorThief node module

## Schema 
The backend of the project pulls data from [TheMovieDb API](https://www.themoviedb.org/) which is a vast database of 10s of thousands of film and television data. The user can use the app to easly filter the data by upcoming, now playing, and now playing films. The user can also search by keyword. In addition to the movie api, there is a upload class that takes in an image URL and a palette number. This allows the user to upload their own images and give a number of palettes they want to display.

# Code Excerpt 
```
function mainColor(event, $textDiv, $div, $image){
  $image.crossOrigin="Anonymous"
  if($div.style.backgroundColor === ''){
    if ($image.complete) {
      const colors = colorThief.getColor($image)
      const colorPalettes = colorThief.getPalette($image, 7)
      displayColorPalette(colorPalettes, $textDiv, $image)
      checkBrightness(colors, $div)
    } else {
      $image.addEventListener('load', () => {
        colorThief.getColor($image);
        const colors = colorThief.getColor($image)
        const colorPalattes = colorThief.getPalette($image, 7)
        displayColorPalette(colorPalattes, $textDiv, $image)
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
```

