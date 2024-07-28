import { vec2, vec3, mat4 } from "gl-matrix";
import clamp from "utils/clamp";

export default class Camera {
  private readonly canvas: HTMLCanvasElement;
  private readonly rotationSpeed = 0.007;
  private readonly zoomSpeed = 0.005;
  private readonly panSpeed = 0.01;

  private projection = mat4.create();
  private view = mat4.create();
  private target = vec3.create();
  private position = vec3.create();
  private lastMousePos = vec2.create();
  private isRotating = false;
  private isPanning = false;
  private distance = 15.0;
  private yaw = 0.7;
  private pitch = 0.5;

  constructor(
    canvas: HTMLCanvasElement,
    target: vec3,
    width: number,
    height: number
  ) {
    this.canvas = canvas;
    this.target = target;

    this.updateProjectionMatrix(width, height);
    this.addEventListeners();
  }

  public updateProjectionMatrix(width: number, height: number) {
    mat4.perspective(this.projection, Math.PI / 4, width / height, 0.1, 1000);
  }

  public rotate(x: number, y: number) {
    this.yaw -= x * this.rotationSpeed;

    const pitch_range = Math.PI / 2 - Number.EPSILON;
    this.pitch += y * this.rotationSpeed;
    this.pitch = clamp(this.pitch, -pitch_range, pitch_range);
  }

  public pan(x: number, y: number) {
    const direction = vec3.sub(vec3.create(), this.target, this.position);
    vec3.normalize(direction, direction);

    const right = vec3.cross(vec3.create(), direction, [0.0, 1.0, 0.0]);
    vec3.normalize(right, right);

    const up = vec3.cross(vec3.create(), right, direction);

    const pan_h = vec3.scale(vec3.create(), right, x * this.panSpeed);
    const pan_v = vec3.scale(vec3.create(), up, y * -this.panSpeed);

    vec3.sub(this.target, this.target, pan_v);
    vec3.sub(this.target, this.target, pan_h);
  }

  public update() {
    const position = vec3.fromValues(
      this.distance * Math.sin(this.yaw) * Math.cos(this.pitch),
      this.distance * Math.sin(this.pitch),
      this.distance * Math.cos(this.yaw) * Math.cos(this.pitch)
    );
    vec3.add(position, position, this.target);
    this.position = position;
  }

  public get projectionMatrix() {
    return this.projection;
  }

  public get viewMatrix() {
    return mat4.lookAt(this.view, this.position, this.target, [0.0, 1.0, 0.0]);
  }

  private addEventListeners() {
    this.canvas.addEventListener("mousedown", (e: MouseEvent) => {
      if (e.button === 0) this.isRotating = true;
      if (e.button === 2) this.isPanning = true;
    });

    this.canvas.addEventListener("mouseup", (e: MouseEvent) => {
      if (e.button === 0) this.isRotating = false;
      if (e.button === 2) this.isPanning = false;
    });

    this.canvas.addEventListener("mousemove", (e: MouseEvent) => {
      const dx = e.clientX - this.lastMousePos[0];
      const dy = e.clientY - this.lastMousePos[1];

      if (this.isRotating) this.rotate(dx, dy);
      if (this.isPanning) this.pan(dx, dy);

      this.lastMousePos = [e.clientX, e.clientY];
    });

    this.canvas.addEventListener("wheel", (e: WheelEvent) => {
      const zoomAmount = e.deltaY * this.zoomSpeed;
      this.distance = clamp(this.distance + zoomAmount, 0.3, 45.0);
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.isRotating = false;
      this.isPanning = false;
    });

    this.canvas.addEventListener("contextmenu", (e: MouseEvent) => {
      e.preventDefault();
    });
  }
}
