
let pixelDensities = 5;
let circleRadius = 5;
let animated = false;
let echo = false;
let trail = false;
let filled = false;
let pulse = false;
let rotation = false;
let firstCircleOpacity = 255;
let text = 'ABC';
let opacity = 255;
let img, lerpPos, lerpPulseVal, shapeXpos, shapeYpos;
let direction = true;
let counterDirection = true;
let fontSize = 150;
let counter = 0;
let radius = 0;
let step = 20;
let randomness = 50;
let startPoint = [];
let endPoint = [];
let angle = 0;
let addedAngle = 0.01;
let pulseStep = 20;
let firstCircleRadius = 5;
let secondCircleRadius = 5;
let secondCircleOpacity = 255;
let thirdCircleRadius = 5;
let thirdCircleOpacity = 255;
let firstSet = true;
let secondSet = false;
let thirdSet = false;

function preload() {
  myFont = loadFont('./data/FreeSansBold.ttf');
  img = loadImage('data/color.png');
}

function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent('canvasHolder');
  pixelDensity(1);

  background(0);

  fontSizeSlider = createSlider(100, 200, fontSize);
  fontSizeSlider.parent('fontSizeController');
  fontSizeSlider.mouseReleased(update);

  densitySlider = createSlider(1, 20, pixelDensities);
  densitySlider.parent('densityController');
  densitySlider.mouseReleased(update);

  radiusSlider = createSlider(1, 10, circleRadius);
  radiusSlider.parent('radiusController');
  radiusSlider.mouseReleased(update);

  randomSlider = createSlider(0, 100, randomness);
  randomSlider.parent('randomController');
  randomSlider.mouseReleased(update);

  fillCheckbox = createCheckbox(' Fill', false);
  fillCheckbox.parent('fillController');
  fillCheckbox.changed(update);

  animateCheckbox = createCheckbox(' Animate', false);
  animateCheckbox.parent('animateController');
  animateCheckbox.changed(update);

  pulseCheckbox = createCheckbox(' Pulse', false);
  pulseCheckbox.parent('pulseController');
  pulseCheckbox.changed(update);

  rotationCheckbox = createCheckbox(' Rotate', false);
  rotationCheckbox.parent('rotationController');
  rotationCheckbox.changed(update);

  trailCheckbox = createCheckbox(' Trail', false);
  trailCheckbox.parent('trailController');
  trailCheckbox.changed(update);

  echoCheckbox = createCheckbox(' Smoke', false);
  echoCheckbox.parent('echoController');
  echoCheckbox.changed(update);

  input = createInput('ABC');
  input.parent('inputController');
  input.input(update);

  rectSize = width / pixelDensities;

  img.loadPixels();
  setUpText();
  createArrays();
}

let i = 0;
let j = 0;
let k = 0;
function draw() {
  // If smoke is selected
  if (echo)  {
    i++;
    j++;
    k++;

    // First set of smoke rings
    // Within 450 iterations reset circle opacities and radiuses
    if (i <= 450) {
      // Extended circle radius and reduced opacity as circles expand
      firstSet = true;
      firstCircleOpacity = firstCircleOpacity - 0.5;
      firstCircleRadius = firstCircleRadius + 2;
    }
    else {
      i = 0;
      firstCircleRadius = circleRadius;
      firstCircleOpacity = 255;
    }

    // Second set of smoke rings
    // Within 150 and 600 iterations reset circle opacities and radiuses
    if (j >= 150) {
      secondSet = true;
      secondCircleOpacity = secondCircleOpacity - 0.5;
      secondCircleRadius = secondCircleRadius + 2;
      if (j >= 600) {
        j = 150;
        secondCircleOpacity = 255;
        secondCircleRadius = circleRadius;
      }
    }
    else {
      secondSet = false;
    }

    // Third set of smoke rings
    // Within 300 and 450 iterations reset circle opacities and radiuses
    if (k >= 300) {
      thirdSet = true;
      thirdCircleOpacity = thirdCircleOpacity - 0.5;
      thirdCircleRadius = thirdCircleRadius + 2;
      if (k >= 750) {
        k = 340;
        thirdCircleOpacity = 255;
        thirdCircleRadius = circleRadius;
      }
    }
    else {
      thirdSet = false;
    }
  }

  // If smoke is unselected opacity and radius are set to defaults
  if (echo === false)  {
    firstCircleOpacity = 255;
    circleRadius = radiusSlider.value();
  }

  // Creates trail effect if trail selected, using background parameters
  if (trail === 0)  {
    background(0);
  }
  else {
    background(0, 30);
  }

  for (let i = 0; i < startPoint.length - 1; i++) {
    if (filled) {
      fill(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], opacity);
      stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], opacity);
    }
    else {
      noFill();
      stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], opacity);
    }

    shapeXpos = lerp(startPoint[i].randomXpos, endPoint[i].xPos, lerpPos);
    shapeYpos = lerp(startPoint[i].randomYpos, endPoint[i].yPos, lerpPos);

    // Lerping between start and finish positions to show animation effect
    lerpPos = (counter / startPoint.length) * step;

    // Lerping between circle radius min and max to show pulse effect
    lerpPulseVal = (radius / startPoint.length) * step;

    if (lerpPos > 1) {
      lerpPos = 1
    }

    if (lerpPulseVal > 0) {
      if (rotation) {
        push();
          rectMode(CENTER);
          translate(shapeXpos, shapeYpos);
          rotate(angle);
          ellipseMode(CENTER);
          if (trail) {
            if (echo) {
              ellipseMode(CENTER);
              ellipse(0, 0, circleRadius, circleRadius);
              if (secondSet) {
                ellipseMode(CENTER);
                stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], secondCircleOpacity);
                ellipse(0, 0, secondCircleRadius, secondCircleRadius);
              }
              if (thirdSet) {
                ellipseMode(CENTER);
                stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], thirdCircleOpacity);
                ellipse(0, 0, thirdCircleRadius, thirdCircleRadius);
              }
            }
            else {
              rect(0, 0, radius, radius);
            }
          }
          else {
            if (echo) {
              ellipseMode(CENTER);
              ellipse(0, 0, circleRadius, circleRadius);
              if (secondSet) {
                ellipseMode(CENTER);
                stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], secondCircleOpacity);
                ellipse(0, 0, secondCircleRadius, secondCircleRadius);
              }
              if (thirdSet) {
                ellipseMode(CENTER);
                stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], thirdCircleOpacity);
                ellipse(0, 0, thirdCircleRadius, thirdCircleRadius);
              }
            }
            else {
              rect(0, 0, radius, radius);
            }
          }
        pop();
        angle += addedAngle;
      }
      else {
        angle = 0;
        if (trail) {
          if (echo) {
            ellipseMode(CENTER);
            ellipse(shapeXpos, shapeYpos, circleRadius, circleRadius);
            if (secondSet) {
              ellipseMode(CENTER);
              stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], secondCircleOpacity);
              ellipse(0, 0, secondCircleRadius, secondCircleRadius);
            }
            if (thirdSet) {
              ellipseMode(CENTER);
              stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], thirdCircleOpacity);
              ellipse(0, 0, thirdCircleRadius, thirdCircleRadius);
            }
          }
          else {
            rect(shapeXpos, shapeYpos, radius, radius);
          }
        }
        else {
          if (echo) {
            ellipseMode(CENTER);
            ellipse(shapeXpos, shapeYpos, circleRadius, circleRadius);
            if (secondSet) {
              ellipseMode(CENTER);
              stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], secondCircleOpacity);
              ellipse(0, 0, secondCircleRadius, secondCircleRadius);
            }
            if (thirdSet) {
              ellipseMode(CENTER);
              stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], secondCircleOpacity);
              ellipse(0, 0, thirdCircleRadius, thirdCircleRadius);
            }
          }
          else {
            rect(shapeXpos, shapeYpos, radius, radius);
          }
        }
      }
    }

    else {
      if (rotation) {
        push();
          rectMode(CENTER);
          translate(shapeXpos, shapeYpos);
          rotate(angle);
          ellipseMode(CENTER);
          if (trail) {
            if (echo) {
              if (firstSet) {
                stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], firstCircleOpacity);
                ellipse(0, 0, secondCircleRadius, secondCircleRadius);
              }
              if (secondSet) {
                stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], secondCircleOpacity);
                ellipse(0, 0, secondCircleRadius, secondCircleRadius);
              }
              if (thirdSet) {
                stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], thirdCircleOpacity);
                ellipse(0, 0, thirdCircleRadius, thirdCircleRadius);
              }
            }
            else {
              rect(0, 0, radius, radius);
            }
          }
          else {
            if (echo) {
              ellipseMode(CENTER);
              if (firstSet) {
                stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], firstCircleOpacity);
                ellipse(0, 0, circleRadius, firstCircleRadius);
              }
              if (secondSet) {
                stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], secondCircleOpacity);
                ellipse(0, 0, secondCircleRadius, secondCircleRadius);
              }
              if (thirdSet) {
                stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], thirdCircleOpacity);
                ellipse(0, 0, thirdCircleRadius, thirdCircleRadius);
              }
            }
            else {
              rect(0, 0, radius, radius);
            }
          }
        pop();
        angle += addedAngle;
      }
      else {
        angle = 0;
        if (trail) {
          if (echo) {
            ellipseMode(CENTER);
            if (firstSet) {
              stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], firstCircleOpacity);
              ellipse(shapeXpos, shapeYpos, firstCircleRadius, firstCircleRadius);
            }
            if (secondSet) {
              stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], secondCircleOpacity);
              ellipse(shapeXpos, shapeYpos, secondCircleRadius, secondCircleRadius);
            }
            if (thirdSet) {
              stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], thirdCircleOpacity);
              ellipse(shapeXpos, shapeYpos, thirdCircleRadius, thirdCircleRadius);
            }
          }
          else {
            rect(shapeXpos, shapeYpos, circleRadius, circleRadius);
          }
        }
        else {
          if (echo) {
            ellipseMode(CENTER);
            if (firstSet) {
              stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], firstCircleOpacity);
              ellipse(shapeXpos, shapeYpos, firstCircleRadius, firstCircleRadius);
            }
            if (secondSet) {
              stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], secondCircleOpacity);
              ellipse(shapeXpos, shapeYpos, secondCircleRadius, secondCircleRadius);
            }
            if (thirdSet) {
              stroke(endPoint[i].colour.levels[0],endPoint[i].colour.levels[1],endPoint[i].colour.levels[2], thirdCircleOpacity);
              ellipse(shapeXpos, shapeYpos, thirdCircleRadius, thirdCircleRadius);
            }
          }
          else {
            rect(shapeXpos, shapeYpos, circleRadius, circleRadius);
          }
        }
      }
    }
  }
  lerpPulse();
  lerpPosition();
}

function setUpText() {
  textImg = createGraphics(500,500);
  textImg.pixelDensity(1);
  textImg.background(255);
  textImg.textFont(myFont);
  textImg.textSize(fontSize);
  textImg.textAlign(CENTER, CENTER);
  textImg.text(text, width/2, height/2, 50, 50);
  textImg.loadPixels();
}

function createArrays() {
  for (let y = 0; y < textImg.height; y += pixelDensities) {
    for (let x = 0; x < textImg.width; x += pixelDensities) {
      let index =  (x + y * textImg.width) * 4;
      let r = textImg.pixels[index];

      if (r < 128) {
        let rVal = img.pixels[index];
        let gVal = img.pixels[index + 1];
        let bVal = img.pixels[index + 2];
        let myCol = color(rVal, gVal, bVal);

        endPoint.push({
          xPos: x,
          yPos: y,
          colour: myCol
        });

        startPoint.push({
          randomXpos: x + Math.floor(random(-randomness, randomness)),
          randomYpos: y + Math.floor(random(-randomness, randomness)),
          colour: myCol
        });
      }
    }
  }
}

// Lerps position
function lerpPosition() {
  if ((animated) & direction === true) {
    if (counter * step < startPoint.length) {
        counter++;
    }
    else {
      direction = false;
      counter--;
    }
  }
  else {
    if (counter * step > 0) {
      counter--;
    }
    else {
      direction = true;
    }
  }
}

// Lerps radius of circle from 5 - 30 so circle appears to pulse
function lerpPulse() {
  if (pulse) {
    if (counterDirection) {
      if (radius < 30) {
        radius++;
      }
      else {
        counterDirection = false;
        radius--;
      }
    }
    else {
      if (radius > 0) {
        radius--;
      }
      else {
        counterDirection = true;
      }
    }
  }
}

function update() {
  circleRadius = radiusSlider.value();
  pixelDensities = densitySlider.value();
  fontSize = fontSizeSlider.value();
  randomness = randomSlider.value();
  text = input.value();

  if (fillCheckbox.checked() == 1) {
    filled = 1;
  }
  else {
    filled = 0;
  }

  if (animateCheckbox.checked() == 1) {
    animated = 1;
  }
  else {
    animated = 0;
  }

  if (pulseCheckbox.checked() == 1) {
    pulse = 1;
  }
  else {
    pulse = 0;
    radius = 0;
  }

  if (rotationCheckbox.checked() == 1) {
    rotation = 1;
  }
  else {
    rotation = 0;
  }

  if (trailCheckbox.checked() == 1) {
    trail = 1;
  }
  else {
    trail = 0;
  }

  if (echoCheckbox.checked() == 1) {
    echo = 1;
  }
  else {
    echo = 0;
  }

  startPoint = [];
  endPoint = [];
  createArrays();
  counter = 0;
}

function reverseRotation () {
  addedAngle =  addedAngle * -1;
}

function keyReleased() {
    if (keyCode === 's' || keyCode === 'S') saveCanvas(gd.timestamp(), 'png');
}
