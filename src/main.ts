import "./style.css";
import vertexShader from "./shaders/vertex.glsl?raw";
import fragmentShader from "./shaders/fragment.glsl?raw";
import { panic } from "./util";

type ShaderInfo = {
  type: number;
  code: string;
};

let gl: WebGLRenderingContext | null = null;
let glCanvas: HTMLCanvasElement | null = null;

let aspectRatio = 1;
let currentRotation = [0, 1];
let currentScale = [1.0, 1.0];

let vertexArray;
let vertexBuffer: WebGLBuffer;
let vertexNumComponents: number;
let vertexCount: number;

let uScalingFactor;
let uGlobalColor;
let uRotationVector;
let aVertexPosition;

let shaderProgram: WebGLProgram;
let currentAngle = 0.0;
let previousTime = 0.0;
let degreesPerSecond = 90.0;

window.addEventListener("load", startup, false);

function startup() {
  glCanvas = document.getElementById("glcanvas") as HTMLCanvasElement;
  gl = glCanvas.getContext("webgl");

  if (!gl) {
    console.log("WebGL not supported");
    return;
  }

  const shaderSet: ShaderInfo[] = [
    {
      type: gl.VERTEX_SHADER,
      code: vertexShader,
    },
    {
      type: gl.FRAGMENT_SHADER,
      code: fragmentShader,
    },
  ];

  shaderProgram =
    buildShaderProgram(shaderSet) || panic("Error building shader program");

  aspectRatio = glCanvas.width / glCanvas.height;
  currentRotation = [0, 1];
  currentScale = [1.0, aspectRatio];

  vertexArray = new Float32Array([
    -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5,
  ]);

  vertexBuffer = gl.createBuffer() || panic("Error creating vertex buffer");

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

  vertexNumComponents = 2;
  vertexCount = vertexArray.length / vertexNumComponents;

  currentAngle = 0.0;

  animateScene();
}

function buildShaderProgram(shaderInfo: ShaderInfo[]) {
  if (!gl) {
    return null;
  }

  const program = gl.createProgram();

  if (!program) {
    return null;
  }

  for (const desc of shaderInfo) {
    const shader = compileShader(desc.code, desc.type);

    if (shader) {
      gl.attachShader(program, shader);
    }
  }

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log("Error linking shader program:");
    console.log(gl.getProgramInfoLog(program));
  }

  return program;
}

function compileShader(code: string, type: number) {
  if (!gl) {
    return;
  }

  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(
      `Error compiling ${
        type === gl.VERTEX_SHADER ? "vertex" : "fragment"
      } shader:`,
    );
    console.log(gl.getShaderInfoLog(shader));
  }
  return shader;
}

function animateScene() {
  if (!gl || !glCanvas || !shaderProgram) {
    return;
  }

  gl.viewport(0, 0, glCanvas.width, glCanvas.height);
  gl.clearColor(0.8, 0.9, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const radians = (currentAngle * Math.PI) / 180.0;
  currentRotation[0] = Math.sin(radians);
  currentRotation[1] = Math.cos(radians);

  gl.useProgram(shaderProgram);

  uScalingFactor = gl.getUniformLocation(shaderProgram, "uScalingFactor");
  uGlobalColor = gl.getUniformLocation(shaderProgram, "uGlobalColor");
  uRotationVector = gl.getUniformLocation(shaderProgram, "uRotationVector");

  gl.uniform2fv(uScalingFactor, currentScale);
  gl.uniform2fv(uRotationVector, currentRotation);
  gl.uniform4fv(uGlobalColor, [0.1, 0.7, 0.2, 1.0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");

  gl.enableVertexAttribArray(aVertexPosition);
  gl.vertexAttribPointer(
    aVertexPosition,
    vertexNumComponents,
    gl.FLOAT,
    false,
    0,
    0,
  );

  gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

  requestAnimationFrame((currentTime) => {
    const deltaAngle =
      ((currentTime - previousTime) / 1000.0) * degreesPerSecond;

    currentAngle = (currentAngle + deltaAngle) % 360;

    previousTime = currentTime;
    animateScene();
  });
}
