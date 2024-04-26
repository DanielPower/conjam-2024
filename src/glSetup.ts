import { panic } from "./util";
import fragmentShaderSource from "./shaders/fragment.glsl?raw";
import vertexShaderSource from "./shaders/vertex.glsl?raw";

export const createTexture = (gl: WebGLRenderingContext): WebGLTexture => {
  const texture = gl.createTexture() || panic("Error creating texture");
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.drawingBufferWidth,
    gl.drawingBufferHeight,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  );

  return texture;
};

export const setupGL = (canvas: HTMLCanvasElement) => {
  const gl = canvas.getContext("webgl") || panic("WebGL not supported");

  // Set viewport to match canvas size
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Create buffer for a square
  const positionBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);

  const shaderProgram = gl.createProgram()!;
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  // Set up attributes and uniforms
  const positionAttributeLocation = gl.getAttribLocation(
    shaderProgram,
    "a_position",
  );
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // Set up attributes and uniforms
  const texLocation = gl.getUniformLocation(shaderProgram, "u_texture")!;
  gl.uniform1i(texLocation, 0);

  return gl;
};

export const render = (gl: WebGLRenderingContext, texture: WebGLTexture) => {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};
