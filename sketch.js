// ---- MEMORY ASSEMBLY: 최종 버전 v2.2 (비율 유지 + 여백 허용 + 중앙정렬) ----

let backgroundFace;
let eyeImgs = [], noseImgs = [], mouthImgs = [];
let flowParts = [];
let floatingParts = []; 
let sound;
let selectedPart = null;

let brainImgs = [];
let brainX = 0;
let brainSpeed = 3;
let brainAngle = 0;
let brainAngleSpeed = 0.08;

const partWidth = 368;
const partHeight = 120;

function preload() {
  backgroundFace = loadImage('assets/background_face.png');
  sound = loadSound('assets/distorted_sound.mp3');

  for (let i = 1; i <= 5; i++) {
    eyeImgs.push(loadImage(`assets/eye${i}.png`));
    noseImgs.push(loadImage(`assets/nose${i}.png`));
    mouthImgs.push(loadImage(`assets/mouth${i}.png`));
  }

  brainImgs.push(loadImage('assets/brain1.png'));
  brainImgs.push(loadImage('assets/brain2.png'));
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < 5; i++) {
    let startY = -i * 400;
    let xPos = windowWidth * 0.15;

    flowParts.push(new FlowPart('eye', xPos, startY));
    flowParts.push(new FlowPart('nose', xPos, startY + 140));
    flowParts.push(new FlowPart('mouth', xPos, startY + 280));
  }
}

function draw() {
  background(0);

  drawBackgroundFace();

  for (let part of flowParts) {
    part.update();
    part.show();
  }

  for (let fp of floatingParts) {
    fp.show();
  }

  if (selectedPart) {
    selectedPart.show(true);
  }

  drawRollingBrain();
}

function mousePressed() {
  for (let i = floatingParts.length - 1; i >= 0; i--) {
    if (floatingParts[i].over(mouseX, mouseY)) {
      selectedPart = floatingParts[i];
      floatingParts.splice(i, 1);
      if (!sound.isPlaying()) {
        sound.play();
      }
      return;
    }
  }

  for (let part of flowParts) {
    if (part.over(mouseX, mouseY)) {
      selectedPart = new FloatingPart(part.type, mouseX, mouseY);
      if (!sound.isPlaying()) {
        sound.play();
      }
      return;
    }
  }

  let clickX = mouseX - brainX;
  let clickY = mouseY - (height - 50);
  if (clickX * clickX + clickY * clickY < (50 * 50)) {
    location.reload();
  }
}

function mouseDragged() {
  if (selectedPart) {
    selectedPart.x = mouseX;
    selectedPart.y = mouseY;
  }
}

function mouseReleased() {
  if (selectedPart) {
    selectedPart.setRandomImage();
    floatingParts.push(selectedPart);
    selectedPart = null;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class FlowPart {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.setRandomImage();
  }

  setRandomImage() {
    if (this.type === 'eye') this.img = random(eyeImgs);
    if (this.type === 'nose') this.img = random(noseImgs);
    if (this.type === 'mouth') this.img = random(mouthImgs);
  }

  update() {
    this.y += 2;
    if (this.y > height + 200) {
      this.y = -400;
      this.setRandomImage();
    }
  }

  show() {
    imageMode(CENTER);
    image(this.img, this.x, this.y, partWidth, partHeight);
  }

  over(px, py) {
    return (px > this.x - partWidth/2 && px < this.x + partWidth/2 &&
            py > this.y - partHeight/2 && py < this.y + partHeight/2);
  }
}

class FloatingPart {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.setRandomImage();
  }

  setRandomImage() {
    if (this.type === 'eye') this.img = random(eyeImgs);
    if (this.type === 'nose') this.img = random(noseImgs);
    if (this.type === 'mouth') this.img = random(mouthImgs);
  }

  show(isDragging = false) {
    imageMode(CENTER);
    if (isDragging) {
      push();
      translate(this.x + random(-2,2), this.y + random(-2,2));
      image(this.img, 0, 0, partWidth, partHeight);
      pop();
    } else {
      image(this.img, this.x, this.y, partWidth, partHeight);
    }
  }

  over(px, py) {
    return (px > this.x - partWidth/2 && px < this.x + partWidth/2 &&
            py > this.y - partHeight/2 && py < this.y + partHeight/2);
  }
}

function drawRollingBrain() {
  let blinkSpeed = 10;
  let brainImg = brainImgs[int(frameCount / blinkSpeed) % 2];

  push();
  translate(brainX, height - 50);
  rotate(brainAngle);
  imageMode(CENTER);
  image(brainImg, 0, 0, 100, 100);
  pop();

  brainX += brainSpeed;
  brainAngle += brainAngleSpeed;

  if (brainX > width) {
    brainX = 0;
  }
}

function drawBackgroundFace() {
  push();
  imageMode(CENTER);

  let imgAspect = backgroundFace.width / backgroundFace.height;
  let canvasAspect = width / height;

  let drawWidth, drawHeight;

  if (canvasAspect > imgAspect) {
    // 캔버스가 더 넓음 -> 이미지 너비를 캔버스에 맞추고, 높이는 비율에 따라 줄어듦
    drawWidth = width;
    drawHeight = width / imgAspect;
  } else {
    // 캔버스가 더 높음 -> 이미지 높이를 캔버스에 맞추고, 너비는 비율에 따라 줄어듦
    drawHeight = height;
    drawWidth = height * imgAspect;
  }

  image(backgroundFace, width/2, height/2, drawWidth, drawHeight);
  pop();
}
