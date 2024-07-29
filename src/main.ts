import Application, { WebGLContext } from "./core/application";
import ShaderProgram from "./core/shader_program";
import Camera from "./core/camera";
import Mesh from "./core/mesh";
import Grid from "./helpers/grid";
import Plane from "core/plane";

import vertexShaderSrc from "shaders/default_vert.glsl";
import fragmentShaderSrc from "shaders/default_frag.glsl";

const app = new Application("#webgl-app");
const plane = new Plane(5, 5, 1, 1);

let program: ShaderProgram;
let camera: Camera;
let mesh: Mesh;
let grid: Grid;

app.initialize((gl: WebGLContext) => {
  program = new ShaderProgram(gl, [
    [vertexShaderSrc, gl.VERTEX_SHADER],
    [fragmentShaderSrc, gl.FRAGMENT_SHADER],
  ]);

  camera = new Camera(app.getCanvas(), [0, 0, 0]);

  grid = new Grid(gl, 16);
  mesh = new Mesh(gl, plane.vertices, plane.indices);
});

app.tick((_: number) => {
  program.use();
  camera.update();

  const modelView = camera.viewMatrix;
  program.setUniformMat4("Projection", camera.projectionMatrix);
  program.setUniformMat4("ModelView", modelView);

  mesh.draw(program);
  grid.draw(camera);
});

app.onResize((width: number, height: number) => {
  camera.updateProjectionMatrix(width, height);
});
