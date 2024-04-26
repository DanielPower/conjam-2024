import "./style.css";
import { createTexture, render, setupGL } from "./glSetup";

const WIDTH = 400;
const HEIGHT = 400;
let isRunning = false;

const initialData = new Uint8Array(WIDTH * HEIGHT * 4);
for (let i = 0; i < initialData.length; i += 4) {
  const value = Math.random() > 0.5 ? 255 : 0;
  initialData[i] = value
  initialData[i + 1] = value
  initialData[i + 2] = value
  initialData[i + 3] = 255;
}

function startup() {
  const canvas = document.getElementById("glcanvas") as HTMLCanvasElement;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const gl = setupGL(canvas);

  // Set viewport to match canvas size
  gl.viewport(0, 0, canvas.width, canvas.height);

  let textureA = createTexture(gl);
  let textureB = createTexture(gl);

  gl.bindTexture(gl.TEXTURE_2D, textureA);
  gl.texImage2D(
  gl.TEXTURE_2D,
    0,
    gl.RGBA,
    WIDTH,
    HEIGHT,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    initialData,
  );

  const step = () => {
    render(gl, textureA, textureB);
    [textureA, textureB] = [textureB, textureA];
  }

  function renderLoop() {
    if (isRunning) {
      step();
    }
    requestAnimationFrame(() => renderLoop());
  }
  renderLoop();

  const stepButton = document.getElementById('step')!;
  const playButton = document.getElementById('play')!;
  stepButton.addEventListener("click", () => step());
  playButton.addEventListener("click", () => {
    isRunning = !isRunning
  });
}

window.addEventListener("load", startup, false);

