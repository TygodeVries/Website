

let winWidth = 128;
let winHeight = 128;
let backgroundImg;
let foregroundImg;
let faces = [];

let output;

function setup() {
  // Create canvas
  let canvas = createCanvas(winWidth, winHeight);
  canvas.style('width', '512px');
  canvas.style('height', '512px');
  canvas.style('image-rendering', 'pixelated');
  noSmooth();

  const backInput = document.getElementById('backFileInput');
  const foreInput = document.getElementById('foreFileInput');

  if (backInput) backInput.addEventListener('change', handleBackgroundFileSelect);
  if (foreInput) foreInput.addEventListener('change', handleForegroundFileSelect);

  output = document.createElement('div');
  output.innerHTML = `
<pre><code class="language-java">
PhotoLayout layout = new PhotoLayout("test-ride-background", "test-ride-foreground");
</code></pre>
`;
  document.body.appendChild(output);
  Prism.highlightAll();
}


function draw() {
  background(51);

  if (backgroundImg) {
    image(backgroundImg, 0, 0, winWidth, winHeight);
  }


  faces.forEach(face => {
    if (face.img) {
      image(face.img, face.x, face.y, face.w, face.h);
      
    }
  });

  if (foregroundImg) {
    image(foregroundImg, 0, 0, winWidth, winHeight);
  }
}

function handleBackgroundFileSelect(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      backgroundImg = loadImage(e.target.result);
    };
    reader.readAsDataURL(file);
  } else {
    console.log('Not an image file!');
  }
}

function handleForegroundFileSelect(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      foregroundImg = loadImage(e.target.result);
    };
    reader.readAsDataURL(file);
  } else {
    console.log('Not an image file!');
  }
}

const faceCache = new Map();

function getFace(type, uuid) {
  return new Promise((resolve, reject) => {
    const key = `${type}:${uuid}`;
    if (faceCache.has(key)) {
      resolve(faceCache.get(key));
      return;
    }
    const url = getFaceUrl(type, uuid);
    if (!url) {
      reject(new Error("Invalid face type"));
      return;
    }
    loadImage(url, img => {
      faceCache.set(key, img);
      resolve(img);
    }, () => {
      reject(new Error("Failed to load face image"));
    });
  });
}

function getFaceUrl(type, uuid) {
  switch (type) {
    case "FLAT_HEAD":
      return `https://mc-heads.net/avatar/${uuid}/16`;
    case "FLAT_BODY":
      return `https://mc-heads.net/player/${uuid}/16`;
    case "ISO_HEAD_RIGHT":
      return `https://mc-heads.net/head/${uuid}/16/right`;
    case "ISO_HEAD_LEFT":
      return `https://mc-heads.net/head/${uuid}/16/left`;
    case "ISO_BODY_RIGHT":
      return `https://mc-heads.net/body/${uuid}/16/right`;
    case "ISO_BODY_LEFT":
      return `https://mc-heads.net/body/${uuid}/16/left`;
    default:
      return null;
  }
}

function addFace() {
  const facesDiv = document.getElementById("faces");
  
  const container = document.createElement('div');
  container.classList.add('face-settings');
  
  container.innerHTML = `
    <select name="faces" class="face-types">
      <option value="FLAT_HEAD">FLAT_HEAD</option>
      <option value="FLAT_BODY">FLAT_BODY</option>
      <option value="ISO_HEAD_RIGHT" selected>ISO_HEAD_RIGHT</option>
      <option value="ISO_HEAD_LEFT">ISO_HEAD_LEFT</option>
      <option value="ISO_BODY_RIGHT">ISO_BODY_RIGHT</option>
      <option value="ISO_BODY_LEFT">ISO_BODY_LEFT</option>
    </select>
    <br>X <input type='number' class="face-x" value="0" min="0" max="${winWidth}">
    <br>Y <input type='number' class="face-y" value="0" min="0" max="${winHeight}">
    <br>Width <input type='number' class="face-width" value="16" min="1" max="${winWidth}">
    <br>Height <input type='number' class="face-height" value="16" min="1" max="${winHeight}">
    <button class="remove-face">Remove</button>
  `;
  
  facesDiv.appendChild(container);

  const defaultUUID = "01389c0849694f848d617ffd3a84f19d";

  const faceObj = {
    type: "ISO_HEAD_RIGHT",
    uuid: defaultUUID,
    x: 0,
    y: 0,
    w: 16,
    h: 16,
    img: null,
    container
  };

  faces.push(faceObj);

  getFace(faceObj.type, faceObj.uuid).then(img => {
    faceObj.img = img;
    
  updateCode();
  }).catch(console.error);

  const select = container.querySelector('.face-types');
  const xInput = container.querySelector('.face-x');
  const yInput = container.querySelector('.face-y');
  const wInput = container.querySelector('.face-width');
  const hInput = container.querySelector('.face-height');
  const removeBtn = container.querySelector('.remove-face');

  select.addEventListener('change', () => {
    faceObj.type = select.value;
    getFace(faceObj.type, faceObj.uuid).then(img => {
      faceObj.img = img;
    }).catch(console.error);

    updateCode();
  });
  xInput.addEventListener('input', () => {
    faceObj.x = parseInt(xInput.value) || 0;
    updateCode();
  });
  yInput.addEventListener('input', () => {
    faceObj.y = parseInt(yInput.value) || 0;
    updateCode();
  });
  wInput.addEventListener('input', () => {
    faceObj.w = parseInt(wInput.value) || 16;
    updateCode();
  });
  hInput.addEventListener('input', () => {
    faceObj.h = parseInt(hInput.value) || 16;
    updateCode();
  });

  removeBtn.addEventListener('click', () => {
    faces = faces.filter(f => f !== faceObj);
    facesDiv.removeChild(container);
    updateCode();
  });
}

function updateCode() {
  // Generate Java code
  let code = `PhotoLayout layout = new PhotoLayout("test-ride-background", "test-ride-foreground")`;
  faces.forEach(face => {
    if (face.img) {
      code += `\n\t.withFace(new FaceLayout(FaceType.${face.type}, ${face.x}, ${face.y}, ${face.w}, ${face.h}))`;
    }
  });
  code += ';';

  // Generate JSON
  const jsonOutput = {
    background: "test-ride-background",
    foreground: "test-ride-foreground",
    faces: faces
      .filter(face => face.img)
      .map(face => ({
        type: face.type,
        x: face.x,
        y: face.y,
        width: face.w,
        height: face.h
      }))
  };

  // Create output HTML
  output.innerHTML = `
    <h3>Java</h3>
    <pre><code class="language-java">${code}</code></pre>
    <h3>JSON</h3>
    <pre><code class="language-json">${JSON.stringify(jsonOutput, null, 2)}</code></pre>
  `;

  Prism.highlightAll();
}

