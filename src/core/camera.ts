import { vec2, vec3, mat4, quat } from "gl-matrix";

export default class Camera {
  private canvas: HTMLCanvasElement;
  private projection = mat4.create();
  private view = mat4.create();
  private target = vec3.create();
  private lastMousePos: vec2 | null = null;
  private rotationQuat = quat.create();
  private sensitivity = 0.005;
  private isDragging = false;

  constructor(
    canvas: HTMLCanvasElement,
    target: vec3,
    width: number,
    height: number
  ) {
    this.canvas = canvas;
    this.target = target;

    mat4.perspective(this.projection, Math.PI / 4, width / height, 0.1, 1000);

    this.updateViewMatrix();
    this.addEventListeners();
  }

  public rotate(x: number, y: number) {
    if (this.lastMousePos) {
      let dx = (x - this.lastMousePos[0]) * this.sensitivity * -1;
      let dy = (y - this.lastMousePos[1]) * this.sensitivity * -1;

      const rotationX = quat.setAxisAngle(quat.create(), [1, 0, 0], dy);
      const rotationY = quat.setAxisAngle(quat.create(), [0, 1, 0], dx);

      quat.multiply(this.rotationQuat, rotationY, this.rotationQuat);
      quat.multiply(this.rotationQuat, this.rotationQuat, rotationX);

      quat.normalize(this.rotationQuat, this.rotationQuat);

      this.updateViewMatrix();
    }
  }

  public getProjectionMatrix() {
    return this.projection;
  }

  public getViewMatrix() {
    return this.view;
  }

  private addEventListeners() {
    this.canvas.addEventListener("mousedown", () => {
      this.isDragging = true;
    });

    this.canvas.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
      if (this.isDragging) {
        this.rotate(e.clientX, e.clientY);
      }
      this.lastMousePos = [e.clientX, e.clientY];
    });
  }

  private updateViewMatrix() {
    const eye = vec3.fromValues(0.0, 0.0, 1.0);
    vec3.transformQuat(eye, eye, this.rotationQuat);
    mat4.lookAt(this.view, eye, this.target, [0, 1, 0]);
  }
}
