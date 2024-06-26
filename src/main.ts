import "./style.css";
import {
  compileShaders,
  createConwayProgram,
  createGravityProgram,
  createRenderProgram,
  createTexture,
  render,
  setupGL
} from "./glSetup";

const WIDTH = 1280;
const HEIGHT = 800;
let isRunning = false;

const initialData = new Uint8Array(WIDTH * HEIGHT * 4);
for (let i = 0; i < initialData.length; i += 4) {
  initialData[i] = Math.random() > 0.5 ? 255 : 0
  initialData[i + 1] = 0
  initialData[i + 2] = 0
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

  const shaders = compileShaders(gl);
  const renderProgram = createRenderProgram(gl, shaders);
  const gravityProgram = createGravityProgram(gl, shaders)
  const conwayProgram = createConwayProgram(gl, shaders);

  const step = () => {
    [gravityProgram].forEach(program => {
      render(gl, program, textureA, textureB);
      [textureA, textureB] = [textureB, textureA];
    });
  }

  const renderLoop = () => {
    if (isRunning) {
      step();
    }
    render(gl, renderProgram, textureA, textureB)
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

