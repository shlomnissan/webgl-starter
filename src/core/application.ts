export type WebGLContext = WebGL2RenderingContext;
type ResizeCallback = (width: number, height: number) => void;
type MouseMoveCallback = (x: number, y: number) => void;

export default class Application {
  private gl: WebGLContext | null = null;
  private lastTimestamp = 0;
  private width = 0;
  private height = 0;
  private resizeCallback: ResizeCallback | null = null;
  private canvas_: HTMLCanvasElement | null = null;

  constructor(selector: string) {
    this.canvas_ = document.querySelector<HTMLCanvasElement>(selector);
    if (!this.canvas_) {
      throw new Error(`Failed to inject a Canvas element into '${selector}'`);
    }
    this.resizeCanvas(this.canvas());

    this.gl = this.canvas().getContext(`webgl2`);
    if (this.gl) {
      console.log(`WebGL version ${this.gl.getParameter(this.gl.VERSION)}`);
    } else {
      throw new Error(`Failed to initialize WebGL2`);
    }

    window.addEventListener("resize", () => {
      this.resizeCanvas(this.canvas());
      this.context().viewport(0, 0, this.getWidth(), this.getHeight());
      if (this.resizeCallback) {
        this.resizeCallback(this.getWidth(), this.getHeight());
      }
    });

    this.checkError();
  }

  public getWidth() {
    return this.width;
  }

  public getHeight() {
    return this.height;
  }

  public initialize(callback: (gl: WebGLContext) => void) {
    this.context().enable(this.context().DEPTH_TEST);
    callback(this.context());
  }

  public onResize(callback: ResizeCallback) {
    this.resizeCallback = callback;
  }

  public onMouseMove(callback: MouseMoveCallback) {
    this.canvas().addEventListener("mousemove", (e: MouseEvent) =>
      callback(e.clientX, e.clientY)
    );
  }

  public tick(callback: (gl: WebGLContext, dt: number) => void) {
    const tick = (timestamp: number) => {
      const dt = (timestamp - this.lastTimestamp) / 1000;
      this.lastTimestamp = timestamp;
      callback(this.context(), dt);
      requestAnimationFrame(tick);
      this.checkError();
    };
    requestAnimationFrame(tick);
  }

  private checkError() {
    const error = this.context().getError();
    if (error !== this.context().NO_ERROR) {
      console.error("WebGL error:", error);
    }
  }

  private canvas() {
    if (this.canvas_ == null) {
      throw new Error(`Failed to initialize Canvas element`);
    }
    return this.canvas_;
  }

  private context() {
    if (this.gl == null) {
      throw new Error(`Failed to initialize WebGL application`);
    }
    return this.gl;
  }

  private resizeCanvas(canvas: HTMLCanvasElement) {
    this.width = canvas.clientWidth * window.devicePixelRatio;
    this.height = canvas.clientHeight * window.devicePixelRatio;

    if (canvas.width !== this.width || canvas.height !== this.height) {
      canvas.width = this.width;
      canvas.height = this.height;
    }
  }
}
