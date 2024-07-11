export type WebGLContext = WebGL2RenderingContext;
export type ResizeCallback = (width: number, height: number) => void;

export default class Application {
  private gl: WebGLContext | null = null;
  private lastTimestamp = 0;
  private width = 0;
  private height = 0;
  private resizeCallback: ResizeCallback | null = null;

  constructor(selector: string) {
    const canvas = document.querySelector<HTMLCanvasElement>(selector);
    if (!canvas) {
      throw new Error(`Failed to inject a Canvas element into '${selector}'`);
    }
    this.resizeCanvas(canvas);

    this.gl = canvas.getContext(`webgl2`);
    if (this.gl) {
      console.log(`WebGL version ${this.gl.getParameter(this.gl.VERSION)}`);
    } else {
      throw new Error(`Failed to initialize WebGL2`);
    }

    window.addEventListener("resize", () => {
      this.resizeCanvas(canvas);
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

  public onresize(callback: ResizeCallback) {
    this.resizeCallback = callback;
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
