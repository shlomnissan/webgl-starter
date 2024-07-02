import { mat4 } from "gl-matrix";
import { WebGLContext } from "./webgl_application";

type ShaderSourceWithType = [string, number];

export default class WebGLShaderProgram {
  private gl: WebGLContext;
  private program_: WebGLProgram | null;

  constructor(gl: WebGLContext, shaders: ShaderSourceWithType[]) {
    this.gl = gl;
    this.program_ = this.gl.createProgram();

    const shaderObjects: WebGLShader[] = [];
    shaders.forEach((shaderSourceWithType) => {
      const shader = this.createShader(
        shaderSourceWithType[0],
        shaderSourceWithType[1]
      );
      shaderObjects.push(shader);
      this.gl.attachShader(this.program(), shader);
    });

    this.gl.linkProgram(this.program());
    if (!this.gl.getProgramParameter(this.program(), this.gl.LINK_STATUS)) {
      const message = this.gl.getProgramInfoLog(this.program());
      shaderObjects.forEach((shader) => this.gl.deleteShader(shader));
      this.gl.deleteProgram(this.program_);
      throw new Error(`Error linking program: ${message}`);
    }

    // delete shaders after successful program creation
    shaderObjects.forEach((shader) => this.gl.deleteShader(shader));
  }

  private createShader(source: string, type: number) {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error(`Failed to create a new shader of type ${type}`);
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const message = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error(`Error compiling shader: ${message}`);
    }

    return shader;
  }

  private program() {
    if (!this.program_) {
      throw new Error(`WebGL program is not initialized or has been deleted`);
    }
    return this.program_;
  }

  getUniform(name: string) {
    const location = this.gl.getUniformLocation(this.program(), name);
    if (location === null) {
      throw new Error(`Uniform ${name} not found in shader program`);
    }
    return location;
  }

  setUniformMat4(name: string, value: mat4) {
    const location = this.getUniform(name);
    this.gl.uniformMatrix4fv(location, false, value);
  }

  use() {
    this.gl.useProgram(this.program());
    const error = this.gl.getError();
    if (error !== this.gl.NO_ERROR) {
      throw new Error(`Error using WebGL program: ${error}`);
    }
  }
}
