import "./style.css";

import { mat4, vec3 } from "gl-matrix";

import WebGLApplication, { WebGLContext } from "./webgl/WebGLApplication";
import WebGLShaderProgram from "./webgl/WebGLShaderProgram";

import vertexShaderSrc from "./shaders/vertex.glsl";
import fragmentShaderSrc from "./shaders/fragment.glsl";

import { cubeVertexArray } from "./cube";

const app = new WebGLApplication("#webgl-app");
let program: WebGLShaderProgram | null;
let triangle: WebGLVertexArrayObject | null;

function setProjection(width: number, height: number) {
  if (program === null) return;
  program.use();

  const projection = mat4.create();
  const fov = Math.PI / 4; // 45 degrees radians
  const aspect_ratio = width / height;
  mat4.perspective(projection, fov, aspect_ratio, 0.1, 1000.0);
  program.setUniformMat4("Projection", projection);
}

function makeTriangle(gl: WebGLContext) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, cubeVertexArray, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0);

  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 32, 12);

  gl.bindVertexArray(null);
  return vao;
}

app.initialize((gl: WebGLContext) => {
  // create shader program
  program = new WebGLShaderProgram(gl, [
    [vertexShaderSrc, gl.VERTEX_SHADER],
    [fragmentShaderSrc, gl.FRAGMENT_SHADER],
  ]);

  // set projection
  setProjection(app.getWidth(), app.getHeight());

  // create mesh
  triangle = makeTriangle(gl);
});

app.onresize((width: number, height: number) => {
  setProjection(width, height);
});

app.tick((gl: WebGLContext, _: number) => {
  gl.clearColor(0.0, 0.0, 0.5, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  program?.use();
  const view = mat4.create();
  mat4.lookAt(
    view,
    vec3.fromValues(0.0, 0.0, 1.0),
    vec3.fromValues(0.0, 0.0, 0.0),
    vec3.fromValues(0.0, 1.0, 0.0)
  );

  const model = mat4.create();
  const now = Date.now() / 1000;

  mat4.rotate(model, model, 1, vec3.fromValues(Math.sin(now), Math.cos(now), 0));
  mat4.scale(model, model, vec3.fromValues(0.15, 0.15, 0.15));

  program?.setUniformMat4("ModelView", mat4.mul(mat4.create(), view, model));

  gl.bindVertexArray(triangle);
  gl.drawArrays(gl.TRIANGLES, 0, 36);
});