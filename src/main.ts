import { mat4, vec3 } from "gl-matrix";

import Application, { WebGLContext } from "./core/application";
import ShaderProgram from "./core/shader_program";
import Camera from "./core/camera";
import Mesh from "./core/mesh";

import { cubeVertexArray, cubeVertexCount } from "./mesh/cube";

import vertexShaderSrc from "./shaders/vertex.glsl";
import fragmentShaderSrc from "./shaders/fragment.glsl";

const app = new Application("#webgl-app");

let program: ShaderProgram;
let camera: Camera;
let cube: Mesh;

function setProjection(width: number, height: number) {
  if (program === null) return;
  program.use();
  camera.updateProjectionMatrix(width, height);
  program.setUniformMat4("Projection", camera.projectionMatrix);
}

app.initialize((gl: WebGLContext) => {
  program = new ShaderProgram(gl, [
    [vertexShaderSrc, gl.VERTEX_SHADER],
    [fragmentShaderSrc, gl.FRAGMENT_SHADER],
  ]);

  camera = new Camera(
    app.getCanvas(),
    vec3.fromValues(0, 0, 0),
    app.getWidth(),
    app.getHeight()
  );

  setProjection(app.getWidth(), app.getHeight());
  cube = new Mesh(gl, cubeVertexArray, cubeVertexCount);
});

app.onResize((width: number, height: number) => {
  setProjection(width, height);
});

app.tick((_: number) => {
  program.use();

  const model = mat4.create();
  mat4.scale(model, model, vec3.fromValues(0.1, 0.1, 0.1));

  const modelView = mat4.mul(mat4.create(), camera.viewMatrix, model);
  program.setUniformMat4("ModelView", modelView);

  cube.draw(program);
});
