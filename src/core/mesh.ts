import { WebGLContext } from "./application";
import ShaderProgram from "./shader_program";

export default class Mesh {
  private readonly attribsPerVertex = 8;
  private gl: WebGLContext;
  private vertexData: Float32Array;
  private indexData: Uint16Array;
  private count: number;
  private vao: WebGLVertexArrayObject | null;
  private type: number;

  constructor(
    gl: WebGLContext,
    vertexData: Float32Array,
    indexData: Uint16Array = new Uint16Array()
  ) {
    this.gl = gl;
    this.vertexData = vertexData;
    this.indexData = indexData;
    this.count = vertexData.length / this.attribsPerVertex;
    this.vao = gl.createVertexArray();
    this.type = this.gl.TRIANGLES;

    this.gl.bindVertexArray(this.vao);
    this.processVertexData();
    if (indexData.length) {
      this.processIndexData();
    }
  }

  public draw(program: ShaderProgram) {
    program.use();
    this.gl.bindVertexArray(this.vao);
    if (this.indexData.length) {
      this.gl.drawElements(
        this.type,
        this.indexData.length,
        this.gl.UNSIGNED_SHORT,
        0
      );
    } else {
      this.gl.drawArrays(this.type, 0, this.count);
    }
  }

  public drawLines() {
    this.type = this.gl.LINES;
  }

  private processVertexData() {
    const vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      this.vertexData,
      this.gl.STATIC_DRAW
    );

    const size = Float32Array.BYTES_PER_ELEMENT;
    const stride = this.attribsPerVertex * size;

    // vertices
    this.gl.enableVertexAttribArray(0);
    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, stride, 0);

    // normals
    this.gl.enableVertexAttribArray(1);
    this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, stride, 3 * size);

    // uv
    this.gl.enableVertexAttribArray(2);
    this.gl.vertexAttribPointer(2, 2, this.gl.FLOAT, false, stride, 6 * size);
  }

  private processIndexData() {
    const indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      this.indexData,
      this.gl.STATIC_DRAW
    );
  }
}
