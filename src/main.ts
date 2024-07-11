import "./style.css";

import { mat4, vec3 } from "gl-matrix";

import Application, { WebGLContext } from "./core/application";
import ShaderProgram from "./core/shader_program";
import Camera from "./core/camera";
import { cubeVertexArray } from "./cube";

import vertexShaderSrc from "./shaders/vertex.glsl";
import fragmentShaderSrc from "./shaders/fragment.glsl";

const app = new Application("#webgl-app");

let program: ShaderProgram;
let cube: WebGLVertexArrayObject | null;
let camera: Camera;

function setProjection(width: number, height: number) {
  if (program === null) return;
  program.use();

  camera = new Camera(10, vec3.fromValues(0, 0, 0), width, height);
  program.setUniformMat4("Projection", camera.getProjectionMatrix());
}

function uploadCubeVertexData(gl: WebGLContext) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, cubeVertexArray, gl.STATIC_DRAW);

  // vertices
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0);

  // colors
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 32, 12);

  gl.bindVertexArray(null);
  return vao;
}

app.initialize((gl: WebGLContext) => {
  program = new ShaderProgram(gl, [
    [vertexShaderSrc, gl.VERTEX_SHADER],
    [fragmentShaderSrc, gl.FRAGMENT_SHADER],
  ]);

  setProjection(app.getWidth(), app.getHeight());
  cube = uploadCubeVertexData(gl);
});

app.onresize((width: number, height: number) => {
  setProjection(width, height);
});

app.tick((gl: WebGLContext, _: number) => {
  gl.clearColor(0.0, 0.0, 0.5, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  camera.update();
  program.use();

  const model = mat4.create();
  mat4.rotate(model, model, Math.PI / 4, vec3.fromValues(1, -1, 0));
  mat4.scale(model, model, vec3.fromValues(0.1, 0.1, 0.1));

  const modelView = mat4.mul(mat4.create(), camera.getViewMatrix(), model);
  program.setUniformMat4("ModelView", modelView);

  gl.bindVertexArray(cube);
  gl.drawArrays(gl.TRIANGLES, 0, 36);
});
