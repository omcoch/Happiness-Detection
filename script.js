const video = document.getElementById('video')


function displayText() {
	const textBox = document.getElementById('textBox')
	textBox.innerHTML = 'אתה צריך לחייך יותר!'
	textBox.style.display = "block"
}

function whenSad() {
	displayText()
	document.getElementById('sound').play()
	
	setTimeout(() => {
		document.getElementById('textBox').style.display = "none"
		document.getElementById('sound').pause()
	}, 4000)
	
}



Promise.all([  
  faceapi.nets.tinyFaceDetector.loadFromUri('models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('models'),
  faceapi.nets.faceExpressionNet.loadFromUri('models'),
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {

	var happy_flag = false
	var time = (new Date()).getTime()
  setInterval(async () => {
	const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

	if (detection && detection.expressions.happy > 0.1)
		happy_flag = true
	
	if ((new Date()).getTime() - time > 300000) { // five minutes = 300000 ms, five seconds = 5000 ms
		time = (new Date()).getTime()
		if (happy_flag === true)
			happy_flag = false
		else
			whenSad()
	}
	
  }, 100)
  
})