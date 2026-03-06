
const boxSize = 160;
const boxX = 880;
const boxY = 600;
const boxPadding = 10;

const textBoxSize = 160 - boxPadding*2;
const textBoxX = boxX + boxPadding;
const textBoxY = boxY + boxPadding;

var targetText = "";
var word = "";
var wordDimension = 0;
var fontSize = 0;

var animationURLs = [];
var animationLengths = [60]
var animationIndex = 0;

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
        this.context.roundRect(880, 600, 160, 160, 8);
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
        let self = this;
        var frameIndex = 0;
        setInterval(function() {
            var image = new Image();
            image.onload = function() {
                self.drawWord();
                self.context.drawImage(image, 0, 0);
            }
            image.src = animationURLs[animationIndex][frameIndex];
            frameIndex++;
            if(frameIndex == animationURLs[animationIndex].length) return;
        }, 1000/12);
    }

};

document.addEventListener("DOMContentLoaded", () => {
    processor.doLoad();
});

document.getElementById("inputText").addEventListener("input", (inputObject) => {
    targetText = inputObject.target.value;
    processor.drawWord();
});

document.getElementById("submitButton").addEventListener("click", () => {
    processor.playAnimation();
});