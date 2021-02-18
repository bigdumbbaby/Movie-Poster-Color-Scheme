import ColorThief from './node_modules/colorthief/dist/color-thief.mjs'
const colorThief = new ColorThief();

const $photoUploadForm = document.querySelector('#photo-upload-form') 
const $photoSection = document.querySelector('#photo-section') 

$photoUploadForm.addEventListener('submit', event => loadPhoto(event))

function loadPhoto(event){
  event.preventDefault()
  const uploadPhotoData = new FormData(event.target)
  const imageURL = uploadPhotoData.get('photo')
  const paletteNum = uploadPhotoData.get('paletteNum')

  displayPhoto(imageURL, paletteNum)
  $photoUploadForm.reset()
}

function displayPhoto(imageURL, paletteNum){
  const $image = document.createElement('img')
  const $uploadCard = document.createElement('div')

  $uploadCard.className = 'upload-card'

  $image.src = imageURL 

  $uploadCard.append($image)
  mainColor($image, $uploadCard, paletteNum)

  $photoSection.append($uploadCard)

}

function mainColor($image, $uploadCard, paletteNum){
  $image.crossOrigin="Anonymous"
  if(parseInt(paletteNum) < 2 || parseInt(paletteNum) > 20){
    alert('must give a number between 2 and 20')
  } else {
    if ($image.complete) {
      const colors = colorThief.getColor($image)
      const colorPalettes = colorThief.getPalette($image, parseInt(paletteNum))
      displayColorPalette(colorPalettes, $uploadCard)
      // var thergb = "rgb(" + colors[0] + "," + colors[1] + "," + colors[2] + ")"; 
      // $uploadCard.style.backgroundColor = thergb
      checkBrightness(colors, $uploadCard)
    } else {
      $image.addEventListener('load', () => {
        colorThief.getColor($image);
        const colors = colorThief.getColor($image)
        const colorPalettes = colorThief.getPalette($image, parseInt(paletteNum))
        console.log(paletteNum)
        console.log(colorPalettes)
        displayColorPalette(colorPalettes, $uploadCard)
        // var thergb = "rgb(" + colors[0] + "," + colors[1] + "," + colors[2] + ")"; 
        // $uploadCard.style.backgroundColor = thergb
        checkBrightness(colors, $uploadCard)
      });
    }
  }
}

function displayColorPalette(colorPalettes, $uploadCard){
  const $paletteDiv = document.createElement('div')
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
  $uploadCard.append($paletteDiv)
}

function checkBrightness(colorArray, $uploadCard){
  const thergb = "rgb(" + colorArray[0] + "," + colorArray[1] + "," + colorArray[2] + ")"; 
  $uploadCard.style.backgroundColor = thergb
  const brightness = Math.round(((parseInt(colorArray[0]) * 299) + (parseInt(colorArray[1]) * 587) + (parseInt(colorArray[2]) * 114)) / 1000)
  if(brightness < 150){
    $uploadCard.style.color = "white"
  } else {
    $uploadCard.style.color = "black"
  }
}