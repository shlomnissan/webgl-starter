import { WebGLContext } from "../core/application";
import { vec3 } from "gl-matrix";
import ShaderProgram from "../core/shader_program";
import Mesh from "core/mesh";
import Camera from "core/camera";

import vertexShaderSrc from "shaders/grid_vert.glsl";
import fragmentShaderSrc from "shaders/grid_frag.glsl";

export default class Grid {
  private readonly valuesPerVertex = 8;
  private readonly dimensions: number;
  private readonly mesh: Mesh;

  private shader: ShaderProgram;
  private idx = 0;
  private data: Float32Array;

  constructor(gl: WebGLContext, dimensions: number) {
    this.dimensions = dimensions;

    this.shader = new ShaderProgram(gl, [
      [vertexShaderSrc, gl.VERTEX_SHADER],
      [fragmentShaderSrc, gl.FRAGMENT_SHADER],
    ]);

    const lines = (dimensions + 1) * 2;
    const vertices = lines * 2;
    this.data = new Float32Array(vertices * this.valuesPerVertex);

    this.generateVertices();
    this.mesh = new Mesh(gl, this.data);
    this.mesh.drawLines();
  }

  public draw(camera: Camera) {
    this.shader.use();
    this.shader.setUniformMat4("Projection", camera.projectionMatrix);
    this.shader.setUniformMat4("View", camera.viewMatrix);
    this.mesh.draw(this.shader);
  }

  private generateVertices() {
    const div = this.dimensions / 2;

    let xOffset = -div;
    for (let i = 0; i <= this.dimensions; ++i) {
      const color: vec3 = i == div ? [0.0, 0.0, 0.8] : [0.3, 0.3, 0.3];
      this.addVertex([xOffset, 0.0, -div], color);
      this.addVertex([xOffset, 0.0, div], color);
      xOffset += 1;
    }

    let zOffset = -div;
    for (let i = 0; i <= this.dimensions; ++i) {
      const color: vec3 = i == div ? [0.8, 0.0, 0.0] : [0.3, 0.3, 0.3];
      this.addVertex([-div, 0.0, zOffset], color);
      this.addVertex([div, 0.0, zOffset], color);
      zOffset += 1;
    }
  }

  private addVertex(pos: vec3, color: vec3) {
    this.data[this.idx++] = pos[0];
    this.data[this.idx++] = pos[1];
    this.data[this.idx++] = pos[2];
    this.data[this.idx++] = color[0];
    this.data[this.idx++] = color[1];
    this.data[this.idx++] = color[2];
    this.data[this.idx++] = 0; // u
    this.data[this.idx++] = 0; // v
  }
}
