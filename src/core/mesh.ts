import { WebGLContext } from "./application";
import ShaderProgram from "./shader_program";

export default class Mesh {
  private gl: WebGLContext;
  private data: Float32Array;
  private count: number;
  private vao: WebGLVertexArrayObject | null;

  constructor(gl: WebGLContext, vertexData: Float32Array, count: number) {
    this.gl = gl;
    this.data = vertexData;
    this.count = count;
    this.vao = gl.createVertexArray();

    this.uploadVertexData();
  }

  public draw(program: ShaderProgram) {
    program.use();

    this.gl.bindVertexArray(this.vao);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.count);
  }

  private uploadVertexData() {
    this.gl.bindVertexArray(this.vao);
    const vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.data, this.gl.STATIC_DRAW);

    const attribsPerVertex: number = 8;
    const size: number = Float32Array.BYTES_PER_ELEMENT;
    const stride: number = attribsPerVertex * size;

    // vertices
    this.gl.enableVertexAttribArray(0);
    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, stride, 0);

    // colors
    this.gl.enableVertexAttribArray(1);
    this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, stride, 3 * size);
  }
}
