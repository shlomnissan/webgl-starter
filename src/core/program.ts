import { mat4, vec2 } from "gl-matrix";
import { WebGLContext } from "./application";

type ShaderSourceWithType = [string, number];

export default class Program {
  private readonly uniformRegex =
    /^\s*uniform\s+(?:highp|mediump|lowp|)[\w\s]+\s+(\w+)\s*;\s*$/gm;

  private gl: WebGLContext;
  private program_: WebGLProgram | null;
  private uniformLocations: Map<string, WebGLUniformLocation>;

  constructor(gl: WebGLContext, shaders: ShaderSourceWithType[]) {
    this.gl = gl;
    this.program_ = this.gl.createProgram();
    this.uniformLocations = new Map<string, WebGLUniformLocation>();

    const shaderObjects: WebGLShader[] = [];
    shaders.forEach((shaderSourceWithType) => {
      const shader = this.createShader(
        shaderSourceWithType[0],
        shaderSourceWithType[1]
      );
      shaderObjects.push(shader);
      this.gl.attachShader(this.program, shader);
    });

    this.gl.linkProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      const message = this.gl.getProgramInfoLog(this.program);
      shaderObjects.forEach((shader) => this.gl.deleteShader(shader));
      this.gl.deleteProgram(this.program_);
      throw new Error(`Error linking program: ${message}`);
    }

    // delete shaders after successful program creation
    shaderObjects.forEach((shader) => this.gl.deleteShader(shader));

    shaders.forEach((shader) => this.parseUniforms(shader[0]));
  }

  public getUniform(name: string) {
    const location = this.uniformLocations.get(name);
    if (!location) {
      throw new Error(`Uniform ${name} not found in shader program`);
    }
    return location;
  }

  public setUniformMat4(name: string, value: mat4) {
    this.gl.uniformMatrix4fv(this.getUniform(name), false, value);
  }

  public setUniformVec2(name: string, value: vec2) {
    this.gl.uniform2fv(this.getUniform(name), value);
  }

  public setUniformFloat(name: string, value: number) {
    this.gl.uniform1f(this.getUniform(name), value);
  }

  public use() {
    this.gl.useProgram(this.program);
    const error = this.gl.getError();
    if (error !== this.gl.NO_ERROR) {
      throw new Error(`Error using WebGL program: ${error}`);
    }
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

  private parseUniforms(source: string) {
    let match;
    while ((match = this.uniformRegex.exec(source)) !== null) {
      const name = match[1];
      const location = this.gl.getUniformLocation(this.program, name);
      if (location) {
        this.uniformLocations.set(name, location);
      } else {
        console.warn(
          `Uniform '${name}' is not accessible. ` +
            `It may be unused or improperly configured.`
        );
      }
    }
  }

  private get program() {
    if (!this.program_) {
      throw new Error(`WebGL program is not initialized or has been deleted`);
    }
    return this.program_;
  }
}
