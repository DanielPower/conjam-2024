import "./style.css";
import { createTexture, render, setupGL } from "./glSetup";

const WIDTH = 100;
const HEIGHT = 100;

const initialData = new Uint8Array(WIDTH * HEIGHT * 4);
for (let i = 0; i < initialData.length; i += 4) {
  initialData[i] = Math.random() * 255;
  initialData[i + 1] = Math.random() * 255;
  initialData[i + 2] = Math.random() * 255;
  initialData[i + 3] = 255;
}

window.addEventListener("load", startup, false);

function startup() {
  const canvas = document.getElementById("glcanvas") as HTMLCanvasElement;
  const gl = setupGL(canvas);

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

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

  function renderLoop() {
    render(gl, textureA, textureB);
    requestAnimationFrame(renderLoop);
    [textureA, textureB] = [textureB, textureA];
  }
  renderLoop();
}
