
const boxSize = 240;
const boxX = 840;
const boxY = 560;
const boxCorner = 16;
const boxPadding = 10;

const textBoxSize = boxSize - boxPadding*2;
const textBoxX = boxX + boxPadding;
const textBoxY = boxY + boxPadding;

var targetText = "";
var word = "";
var wordDimension = 0;
var fontSize = 0;

var animationURLs = [];
var animationLengths = [60];
var impactFrames = [[40, 46]];
var animationIndex = 0;

var playing = false;
var intervalID = 0;

let processor = {

    timerCallback: function() {
        if (this.video.ended) {
            return;
        }
        this.computeFrame();
        let self = this;
        setTimeout(function () {
            self.timerCallback();
        }, 0);
    },
  
    doLoad: function() {
        this.composition = document.getElementById("composition");
        this.context = this.composition.getContext("2d");
        let self = this;
        
        for(var a = 0; a < animationLengths.length; a++) {
            animationURLs[a] = [];
            for(var f = 0; f < animationLengths[a]; f++) {
                animationURLs[a][f] = `animations/${a}/${f.toString().padStart(4, "0")}.png`;
            }
        }

        self.drawWord();
    },
  
    computeFrame: function() {
        this.context.drawImage(this.video, 0, 0, this.width, this.height);
        return;
    },

    drawWord: function() {
        this.context.beginPath();
        this.context.rect(0, 0, this.composition.width, this.composition.height);
        this.context.fillStyle = "white";
        this.context.fill();

        this.context.beginPath();
        this.context.roundRect(boxX, boxY, boxSize, boxSize, boxCorner);
        this.context.fillStyle = "black";
        this.context.fill();

        word = targetText.toUpperCase();
        wordDimension = Math.ceil(Math.sqrt(word.length));
        fontSize = textBoxSize/wordDimension;

        this.context.fillStyle = "white";
        this.context.textBaseline = "middle";
        this.context.textAlign = "center";
        this.context.font = `700 ${fontSize}px Roboto Mono`;
        for(let row = 0; row < wordDimension; row++) {
            for(let col = 0; col < wordDimension; col++) {
                let index = row*wordDimension + col;
                let char = word.substring(index, index + 1);
                this.context.fillText(char, textBoxX + (col + 0.5)*fontSize, textBoxY + (row + 0.5)*fontSize);
            }
        }
    },

    playAnimation: function() {
        playing = true;
        let self = this;
        var frameIndex = 0;
        intervalID = setInterval(function() {
            var image = new Image();
            image.onload = function() {
                self.drawWord();
                self.context.drawImage(image, 0, 0);
            }
            image.src = animationURLs[animationIndex][frameIndex];
            if(frameIndex >= impactFrames[animationIndex][0]) {
                if(frameIndex < impactFrames[animationIndex][1]) {
                    document.getElementById("colorOverlay").style.backgroundColor = `hsl(${Math.random()*360}, 100%, 85%)`;
                } else {
                    document.getElementById("colorOverlay").style.backgroundColor = "black";
                }
            }
            frameIndex++;
            if(frameIndex == animationURLs[animationIndex].length) {
                stopAnimation;
            }
        }, 1000/12);
    },

    stopAnimation: function() {
        playing = false;
        clearInterval(intervalID);
        frameIndex = 0;
    }

};

document.addEventListener("DOMContentLoaded", () => {
    processor.doLoad();
});

document.getElementById("inputText").addEventListener("input", (inputObject) => {
    processor.stopAnimation();
    targetText = inputObject.target.value;
    processor.drawWord();
});

document.getElementById("submitButton").addEventListener("click", () => {
    if(!playing){
        
        processor.playAnimation();
    }
});