import './style.css'

import WebGLApplication, { WebGLContext } from './webgl/webgl_application'
import WebGLShaderProgram from './webgl/webgl_shader_program';

import vertexShaderSrc from "./shaders/vertex.glsl";
import fragmentShaderSrc from "./shaders/fragment.glsl";

const app = new WebGLApplication("#window");
let program: WebGLShaderProgram | null;
let vao: WebGLVertexArrayObject | null;

app.initialize((gl: WebGLContext) => {
  // create shader program
  program = new WebGLShaderProgram(gl, [
    [vertexShaderSrc, gl.VERTEX_SHADER],
    [fragmentShaderSrc, gl.FRAGMENT_SHADER]
  ]);

  // create mesh
  vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const vertices = new Float32Array([
    0.0,  0.5, 0.0, 1.0, 0.0, 0.0,
   -0.5, -0.5, 0.0, 0.0, 1.0, 0.0,
    0.5, -0.5, 0.0, 0.0, 0.0, 1.0
  ]);

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);

  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);

  gl.bindVertexArray(null);
});

app.tick((gl: WebGLContext, _: number) => {
  gl.clearColor(0.0, 0.0, 0.5, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  program?.use();
  gl.bindVertexArray(vao);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
});