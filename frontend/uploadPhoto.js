import ColorThief from './node_modules/colorthief/dist/color-thief.mjs'
const colorThief = new ColorThief();

const $photoUploadForm = document.querySelector('#photo-upload-form') 
const $photoSection = document.querySelector('#photo-section') 

$photoUploadForm.addEventListener('submit', event => loadPhoto(event))

fetch('http://localhost:3000/uploads')
  .then(response => response.json())
  .then(uploads => getUploads(uploads))

function getUploads(uploads){
  uploads.forEach(upload => displayPhoto(upload.url, upload.palette_number, upload.id))
}

function loadPhoto(event){
  event.preventDefault()
  const uploadPhotoData = new FormData(event.target)
  const imageURL = uploadPhotoData.get('photo')
  const paletteNum = uploadPhotoData.get('paletteNum')

  const newPalette = {
    "url": imageURL,
    "palette_number": paletteNum
  }

  
  fetch('http://localhost:3000/uploads', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newPalette)
  })
  .then(response => response.json())
  .then(upload => displayPhoto(imageURL, paletteNum, upload.id))

  $photoUploadForm.reset()
}

function displayPhoto(imageURL, paletteNum, uploadId){
  const $image = document.createElement('img')
  const $uploadCard = document.createElement('div')
  const $deleteButton = document.createElement('button')
  const $textDiv = document.createElement('div')
  
  $image.className = 'uploaded-image'
  $uploadCard.className = 'upload-card'
  $deleteButton.className = 'delete-button'
  $deleteButton.textContent = 'x'
  $textDiv.className  = 'upload-text-container'

  $uploadCard.id = 'card-' + uploadId
  $image.src = imageURL 
  $textDiv.append($deleteButton)
  mainColor($image, $uploadCard, paletteNum, $textDiv, $deleteButton)

  $uploadCard.append($image, $textDiv)

  $photoSection.append($uploadCard)
  
  $deleteButton.dataset.uploadId = uploadId 
  $deleteButton.addEventListener('click', deleteUpload)

}

function mainColor($image, $uploadCard, paletteNum, $textDiv, $deleteButton){
  $image.crossOrigin="Anonymous"
  if(parseInt(paletteNum) < 2 || parseInt(paletteNum) > 20){
    alert('must give a number between 2 and 20')
  } else {
    if ($image.complete) {
      const colors = colorThief.getColor($image)
      const colorPalettes = colorThief.getPalette($image, parseInt(paletteNum))
      displayColorPalette(colorPalettes, $textDiv)
      // var thergb = "rgb(" + colors[0] + "," + colors[1] + "," + colors[2] + ")"; 
      // $uploadCard.style.backgroundColor = thergb
      checkBrightness(colors, $uploadCard, $deleteButton)
    } else {
      $image.addEventListener('load', () => {
        colorThief.getColor($image);
        const colors = colorThief.getColor($image)
        const colorPalettes = colorThief.getPalette($image, parseInt(paletteNum))
        displayColorPalette(colorPalettes, $uploadCard)
        // var thergb = "rgb(" + colors[0] + "," + colors[1] + "," + colors[2] + ")"; 
        // $uploadCard.style.backgroundColor = thergb
        checkBrightness(colors, $uploadCard, $deleteButton)
      });
    }
  }
}

function displayColorPalette(colorPalettes, $textDiv){
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
  $textDiv.append($paletteDiv)
}

function checkBrightness(colorArray, $uploadCard, $deleteButton){
  const thergb = "rgb(" + colorArray[0] + "," + colorArray[1] + "," + colorArray[2] + ")"; 
  $uploadCard.style.backgroundColor = thergb
  const brightness = Math.round(((parseInt(colorArray[0]) * 299) + (parseInt(colorArray[1]) * 587) + (parseInt(colorArray[2]) * 114)) / 1000)
  if(brightness < 150){
    $uploadCard.style.color = "white"
    $deleteButton.style.color = "white"
  } else {
    $uploadCard.style.color = "black"
    $deleteButton.style.color = "black"
  }
}

function deleteUpload(event){
  console.log(event.target.dataset.uploadId)
  fetch(`http://localhost:3000/uploads/${event.target.dataset.uploadId}`, {
    method: "DELETE"
  })
  const $imageCard = document.querySelector(`#card-${event.target.dataset.uploadId}`)
  $imageCard.remove()
}