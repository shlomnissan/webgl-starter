import { mat4, vec3 } from "gl-matrix";

import Application, { WebGLContext } from "./core/application";
import ShaderProgram from "./core/shader_program";
import Camera from "./core/camera";
import Mesh from "./core/mesh";
import Grid from "./helpers/grid";

import { cubeVertexArray } from "./mesh/cube";

import vertexShaderSrc from "shaders/default_vert.glsl";
import fragmentShaderSrc from "shaders/default_frag.glsl";

const app = new Application("#webgl-app");

let program: ShaderProgram;
let camera: Camera;
let cube: Mesh;
let grid: Grid;

app.initialize((gl: WebGLContext) => {
  program = new ShaderProgram(gl, [
    [vertexShaderSrc, gl.VERTEX_SHADER],
    [fragmentShaderSrc, gl.FRAGMENT_SHADER],
  ]);

  camera = new Camera(app.getCanvas(), [0, 0, 0]);

  grid = new Grid(gl, 16);
  cube = new Mesh(gl, cubeVertexArray);
});

app.tick((_: number) => {
  program.use();
  camera.update();

  const model = mat4.create();
  mat4.translate(model, model, vec3.fromValues(0.0, 1.0, 0.0));

  const modelView = mat4.mul(mat4.create(), camera.viewMatrix, model);
  program.setUniformMat4("Projection", camera.projectionMatrix);
  program.setUniformMat4("ModelView", modelView);

  cube.draw(program);
  grid.draw(camera);
});

app.onResize((width: number, height: number) => {
  camera.updateProjectionMatrix(width, height);
});
