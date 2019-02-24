var pieces, radius, fft, analyzer, mapMouseX, mapMouseY, audio, toggleBtn, uploadBtn, uploadedAudio, uploadAnim;
var colorPalette = ["#02073c", "#5b0ff5", "#f50fac", "#f50fac"];
var uploadLoading = false;

/*=============================================
  SETUP
=============================================*/

function preload() {
	audio = loadSound("audio/DEMO.mp3");
}

function uploaded(file) {
	uploadLoading = true;
	uploadedAudio = loadSound(file.data, uploadedAudioPlay);
}


function uploadedAudioPlay(audioFile) {

	uploadLoading = false;

	if (audio.isPlaying()) {
		audio.pause();
	}

	audio = audioFile;
	audio.loop();
}

var system;

var dimX = 40;
var dimY = 55;

function setup() {

	uploadAnim = select('#uploading-animation');

	createCanvas(windowWidth, windowHeight);

	toggleBtn = createButton("Play / Pause");

	uploadBtn = createFileInput(uploaded);

	uploadBtn.addClass("upload-btn");
	
	toggleBtn.addClass("toggle-btn");

	toggleBtn.mousePressed(toggleAudio);

	analyzer = new p5.Amplitude();
	fft = new p5.FFT();
	audio.loop();
	
	//particle 
	system = new ParticleSystem(createVector(-250, -200));
}



/*=============================================
  DRAW
=============================================*/
function draw() {


	// Add a loading animation for the uploaded track
	// -----------------------------------------------
	if (uploadLoading) {
		uploadAnim.addClass('is-visible');
	} else {
		uploadAnim.removeClass('is-visible');
	}

	//background(colorPalette[0]);
	background(150);

	translate(windowWidth / 2, windowHeight / 2);

	level = analyzer.getLevel();
	fft.analyze();

	var bass = fft.getEnergy(100, 150);
	var treble = fft.getEnergy(150, 250);
	var mid = fft.getEnergy("mid");

	var mapMid = map(mid, 0, 255, -100, 200);
	var scaleMid = map(mid, 0, 255, 1, 1.5);

	var mapTreble = map(treble, 0, 255, 200, 350);
	var scaleTreble = map(treble, 0, 255, 0, 1);

	var mapBass = map(bass, 0, 255, 50, 200);
	var scalebass = map(bass, 0, 255, 0.05, 1.2);

	 background(0);
	 
	 //draw background
	  drawBackgroundOfBubbles(bass);
	
	  //draw multicolor cicles
	  drawMultiColorCirlces(bass);
	  
	  //draw frequency
	  drawFrequencyBar(bass,mid,treble);
  

}


function toggleAudio() {
	if (audio.isPlaying()) {
		audio.pause();
	} else {
		audio.play();
	}
}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}



//Background of particles 
// A simple Particle class
var Particle = function(position) {
  this.acceleration = createVector(0, 0.001);
  this.velocity = createVector(random(-1, 1), random(-1, 0));
  var positionV=position.copy();
  positionV.x=random(-650.12, 650.15);
  positionV.y=random(-650, 650);
  this.position = positionV;//position.copy();
  this.lifespan = 255.0;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 1;
};

// Method to display
Particle.prototype.display = function() {
   noStroke();
   fill(random(0, 250), random(0, 250), random(0, 250), this.lifespan);
   ellipse(this.position.x, this.position.y, dimX, dimY);
};


// Is the particle still useful?
Particle.prototype.isDead = function(){
  if (this.lifespan < 0) {
    return true;
  } else {
    return false;
  }
};

var ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
	
  this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function() {
  for (var i = this.particles.length-1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};


// to draw bubbles background
function drawBackgroundOfBubbles(bass){
	 if(bass>0){
		   system.addParticle();
		   system.run();
		   }
}

//to draw mutli color circles
function drawMultiColorCirlces(bass){
	  push();
	  var valuesOfarc = bass/50;  
	  var nrm=4;
	      
		   for(var j=valuesOfarc*10;j>1;j--){
			
			if(j%2==0){
				fill(random(0, 250), random(0, 250), random(0, 250), this.lifespan);
				arc(-620, 0, nrm*j, nrm*j, 0, 2 * Math.PI);
				arc(-220, 0, nrm*j, nrm*j, 0, 2 * Math.PI);
				arc(220, 0, nrm*j, nrm*j, 0, 2 * Math.PI);
				arc(620, 0, nrm*j, nrm*j, 0, 2 * Math.PI);
			}else
			{
				//fill(0, 180, 180);
				fill(random(0, 250), random(0, 250), random(0, 250), this.lifespan);
				arc(-620, 0, nrm*j, nrm*j, 0, 2 * Math.PI);
				arc(-220, 0, nrm*j, nrm*j, 0, 2 * Math.PI);
				arc(220, 0, nrm*j, nrm*j, 0, 2 * Math.PI);
				arc(620, 0, nrm*j, nrm*j, 0, 2 * Math.PI);
			}
		} 
	  pop();
	 
}

//to draw frequency bar base on bass mid treble
function drawFrequencyBar(bass,mid,treble){
	
	if(bass>0){
		var rx = 60 * noise(0.01*bass + 40);
		var tx = bass/5;
		var bassVal=bass/2;
		var midVal=mid;
		var trebleVal=treble/5;
		var baseVal=250;
		var barCount=0;
			for (var j = 0; j <821; j+=60) {
				push();
				stroke(5);
				fill(random(139, 255),  random(0, 150), random(0, 140), this.lifespan);
				rect(j, baseVal, 40, 10);
				fill(random(0, 255),  random(0, 255), random(0, 255), this.lifespan);
				rect(-j, baseVal, 40, 10);
				if(barCount%2==0){
					for (var i = 0; i <bassVal; i+=30) {
					rect(j, baseVal-i, 40, 10);
					}
					for (var i = 0; i <bassVal; i+=30) {
					rect(-j, baseVal-i, 40, 10);
					}
				} else
					if(barCount%2==1){
						for (var i = 0; i <midVal; i+=30) {
						rect(j, baseVal-i, 40, 10);
						}
						for (var i = 0; i <midVal; i+=30) {
						rect(-j, baseVal-i, 40, 10);
						}
					}
					else if(barCount%2==3){
						for (var i = 0; i <trebleVal; i+=30) {
						rect(j, baseVal-i, 40, 10);
						}
						for (var i = 0; i <trebleVal; i+=30) {
						rect(-j, baseVal-i, 40, 10);
						}
					}
					barCount++;
					pop();
		}
	}
}