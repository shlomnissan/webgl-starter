import { WebGLContext } from "./application";
import ShaderProgram from "./shader_program";

export default class Mesh {
  private readonly attribsPerVertex = 8;
  private gl: WebGLContext;
  private data: Float32Array;
  private count: number;
  private vao: WebGLVertexArrayObject | null;
  private type: number;

  constructor(gl: WebGLContext, vertexData: Float32Array) {
    this.gl = gl;
    this.data = vertexData;
    this.count = vertexData.length / this.attribsPerVertex;
    this.vao = gl.createVertexArray();
    this.type = this.gl.TRIANGLES;

    this.uploadVertexData();
  }

  public draw(program: ShaderProgram) {
    program.use();

    this.gl.bindVertexArray(this.vao);
    this.gl.drawArrays(this.type, 0, this.count);
  }

  public drawLines() {
    this.type = this.gl.LINES;
  }

  private uploadVertexData() {
    this.gl.bindVertexArray(this.vao);
    const vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.data, this.gl.STATIC_DRAW);

    const size: number = Float32Array.BYTES_PER_ELEMENT;
    const stride: number = this.attribsPerVertex * size;

    // vertices
    this.gl.enableVertexAttribArray(0);
    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, stride, 0);

    // colors
    this.gl.enableVertexAttribArray(1);
    this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, stride, 3 * size);
  }
}
