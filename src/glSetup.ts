import { panic } from "./util";
import fragmentShaderSource from "./shaders/fragment.glsl?raw";
import vertexShaderSource from "./shaders/vertex.glsl?raw";
import conwayShaderSource from "./shaders/conway.glsl?raw";
import gravityShaderSource from "./shaders/gravity.glsl?raw";

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

export const compileShaders = (gl: WebGLRenderingContext) => {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);

  const conwayShader = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(conwayShader, conwayShaderSource);
  gl.compileShader(conwayShader);

  const gravityShader = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(gravityShader, gravityShaderSource);
  gl.compileShader(gravityShader);

  return { vertexShader, fragmentShader, conwayShader, gravityShader };
}

export const createUpdateProgram = (gl: WebGLRenderingContext, shaders: ReturnType<typeof compileShaders>) => {
    const program = gl.createProgram()!;
    gl.attachShader(program, shaders.vertexShader);
    gl.attachShader(program, shaders.fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionAttributeLocation = gl.getAttribLocation(
        program,
        "a_position",
    );
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const texLocation = gl.getUniformLocation(program, "u_texture")!;
    gl.uniform1i(texLocation, 0);

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution")!;
    gl.uniform2f(resolutionLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);

    return program;
}

export const createConwayProgram = (gl: WebGLRenderingContext, shaders: ReturnType<typeof compileShaders>) => {
  const program = gl.createProgram()!;
  gl.attachShader(program, shaders.vertexShader);
  gl.attachShader(program, shaders.conwayShader)
  gl.linkProgram(program);
  gl.useProgram(program);

  const positionAttributeLocation = gl.getAttribLocation(
    program,
    "a_position",
  );
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  const texLocation = gl.getUniformLocation(program, "u_texture")!;
  gl.uniform1i(texLocation, 0);

  const resolutionLocation = gl.getUniformLocation(program, "u_resolution")!;
  gl.uniform2f(resolutionLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);

  return program;
}

export const createGravityProgram = (gl: WebGLRenderingContext, shaders: ReturnType<typeof compileShaders>) => {
  const program = gl.createProgram()!;
  gl.attachShader(program, shaders.vertexShader);
  gl.attachShader(program, shaders.gravityShader)
  gl.linkProgram(program);
  gl.useProgram(program);

  const positionAttributeLocation = gl.getAttribLocation(
    program,
    "a_position",
  );
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  const texLocation = gl.getUniformLocation(program, "u_texture")!;
  gl.uniform1i(texLocation, 0);

  const resolutionLocation = gl.getUniformLocation(program, "u_resolution")!;
  gl.uniform2f(resolutionLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);

  return program;
}

export const setupGL = (canvas: HTMLCanvasElement) => {
  const gl = canvas.getContext("webgl") || panic("WebGL not supported");

  const positionBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );

  return gl;
};

export const render = (gl: WebGLRenderingContext, program: WebGLProgram, inputTexture: WebGLTexture, outputTexture: WebGLTexture) => {
  gl.useProgram(program);

  const framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, outputTexture, 0);

  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    console.error('Error setting up framebuffer');
    return;
  }

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, inputTexture);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};