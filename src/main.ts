import './style.css'

import WebGLShader from './webgl/webgl_shader';

import vertexShaderSrc from "./shaders/vertex.glsl";
import fragmentShaderSrc from "./shaders/fragment.glsl";

import WebGLApplication, { WebGLContext } from './webgl/webgl_application'

const app = new WebGLApplication("#window");

app.initialize((gl: WebGLContext) => {
  const vertShader = WebGLShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
  const fragShader = WebGLShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
});

app.tick((gl: WebGLContext, _: number) => {
  gl.clearColor(0.0, 0.0, 0.5, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // TODO: update/draw
});