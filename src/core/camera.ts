import { vec3, mat4 } from "gl-matrix";

export default class Camera {
  private width: number;
  private height: number;
  private radius: number;
  private projection = mat4.create();
  private view = mat4.create();
  private target = vec3.create();
  private up = vec3.fromValues(0, 1, 0);

  constructor(radius: number, target: vec3, width: number, height: number) {
    this.radius = radius;
    this.target = target;
    this.width = width;
    this.height = height;

    const aspectRatio = width / height;
    mat4.perspective(this.projection, Math.PI / 4, aspectRatio, 0.1, 1000);
  }

  public getProjectionMatrix() {
    return this.projection;
  }

  public getViewMatrix() {
    return this.view;
  }

  public update() {
    const eye = vec3.fromValues(0.0, 0.0, 1.0);
    mat4.lookAt(this.view, eye, this.target, this.up);
  }
}
