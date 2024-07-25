import { vec2, vec3, mat4, quat } from "gl-matrix";
import clamp from "utils/clamp";

export default class Camera {
  private readonly canvas: HTMLCanvasElement;
  private readonly sensitivity = 0.005;

  private projection = mat4.create();
  private view = mat4.create();
  private target = vec3.create();
  private lastMousePos = vec2.create();
  private rotationQuat = quat.create();
  private verticalAngle = 0.0;
  private distance = 15.0;
  private isDragging = false;

  constructor(
    canvas: HTMLCanvasElement,
    target: vec3,
    width: number,
    height: number
  ) {
    this.canvas = canvas;
    this.target = target;

    this.updateProjectionMatrix(width, height);
    this.updateViewMatrix();
    this.addEventListeners();
  }

  public updateProjectionMatrix(width: number, height: number) {
    mat4.perspective(this.projection, Math.PI / 4, width / height, 0.1, 1000);
  }

  public rotate(x: number, y: number) {
    if (this.lastMousePos) {
      let dx = (x - this.lastMousePos[0]) * this.sensitivity * -1;
      let dy = (y - this.lastMousePos[1]) * this.sensitivity * -1;

      // prevent the direction vector from becoming parallel to the camera’s
      // up vector, which causes the camera to flip.
      this.verticalAngle += dy;
      if (Math.abs(this.verticalAngle) > Math.PI / 2 - 0.001) {
        this.verticalAngle -= dy;
        dy = 0;
      }

      const rotationX = quat.setAxisAngle(quat.create(), [1, 0, 0], dy);
      const rotationY = quat.setAxisAngle(quat.create(), [0, 1, 0], dx);

      quat.multiply(this.rotationQuat, rotationY, this.rotationQuat);
      quat.multiply(this.rotationQuat, this.rotationQuat, rotationX);
      quat.normalize(this.rotationQuat, this.rotationQuat);

      this.updateViewMatrix();
    }
  }

  private zoom(deltaY: number) {
    const zoomSensitivity = 0.05;
    const zoomAmount = deltaY * this.sensitivity * zoomSensitivity;
    this.distance = clamp(this.distance + zoomAmount, 0.3, 45.0);
    this.updateViewMatrix();
  }

  public get projectionMatrix() {
    return this.projection;
  }

  public get viewMatrix() {
    return this.view;
  }

  private addEventListeners() {
    this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
      if (e.button == 0) {
        this.isDragging = true;
      }
    });

    this.canvas.addEventListener("mouseup", (e: MouseEvent) => {
      if (e.button == 0) {
        this.isDragging = false;
      }
    });

    this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
      if (this.isDragging) {
        this.rotate(e.clientX, e.clientY);
      }
      this.lastMousePos = [e.clientX, e.clientY];
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener("wheel", (e: WheelEvent) => {
      this.zoom(e.deltaY);
    });

    this.canvas.addEventListener("contextmenu", (e: MouseEvent) => {
      e.preventDefault();
    });
  }

  private updateViewMatrix() {
    const position = vec3.fromValues(0.0, 0.0, this.distance);
    vec3.transformQuat(position, position, this.rotationQuat);
    mat4.lookAt(this.view, position, this.target, [0, 1, 0]);
  }
}
