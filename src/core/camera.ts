import { vec2, vec3, mat4, quat } from "gl-matrix";

export default class Camera {
  private projection = mat4.create();
  private view = mat4.create();
  private target = vec3.create();
  private lastMousePos: vec2 | null = null;
  private rotationQuat = quat.create();
  private sensitivity = 0.005;

  constructor(target: vec3, width: number, height: number) {
    this.target = target;
    const aspectRatio = width / height;
    mat4.perspective(this.projection, Math.PI / 4, aspectRatio, 0.1, 1000);
    this.updateViewMatrix();
  }

  public rotate(x: number, y: number) {
    if (this.lastMousePos) {
      let dx = (x - this.lastMousePos[0]) * this.sensitivity * -1;
      let dy = (y - this.lastMousePos[1]) * this.sensitivity * -1;

      const rotationX = quat.create();
      const rotationY = quat.create();

      quat.setAxisAngle(rotationY, [0, 1, 0], dx);
      quat.setAxisAngle(rotationX, [1, 0, 0], dy);

      quat.multiply(this.rotationQuat, rotationY, this.rotationQuat);
      quat.multiply(this.rotationQuat, this.rotationQuat, rotationX);

      this.updateViewMatrix();
    }
    this.lastMousePos = [x, y];

  }

  public getProjectionMatrix() {
    return this.projection;
  }

  public getViewMatrix() {
    return this.view;
  }

  private updateViewMatrix() {
    const eye = vec3.fromValues(0.0, 0.0, 1.0);
    vec3.transformQuat(eye, eye, this.rotationQuat);
    vec3.add(eye, eye, this.target);
    mat4.lookAt(this.view, eye, this.target, [0, 1, 0]);
  }
}
