import "./style.css";
import { createTexture, render, setupGL } from "./glSetup";

window.addEventListener("load", startup, false);

function startup() {
  const canvas = document.getElementById("glcanvas") as HTMLCanvasElement;
  const gl = setupGL(canvas);

  let textureA = createTexture(gl);
  let textureB = createTexture(gl);

  const texData = new Uint8Array([
    255, 0, 0, 255, // Red
    0, 255, 0, 255, // Green
    0, 0, 255, 255, // Blue
    255, 255, 0, 255, // Yellow
  ]);

  const texData2 = new Uint8Array([
    0, 255, 0, 255, // Green
    255, 0, 0, 255, // Red
    255, 255, 0, 255, // Yellow
    0, 0, 255, 255, // Blue
  ]);

  gl.bindTexture(gl.TEXTURE_2D, textureA);
  gl.texImage2D(
  gl.TEXTURE_2D,
    0,
    gl.RGBA,
    2,
    2,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    texData,
  );

  gl.bindTexture(gl.TEXTURE_2D, textureB);
  gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      2,
      2,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      texData2,
  );

  function renderLoop() {
    [textureA, textureB] = [textureB, textureA];
    render(gl, textureA);
    requestAnimationFrame(renderLoop);
  }
  renderLoop();
}
