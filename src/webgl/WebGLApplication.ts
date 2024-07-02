export type WebGLContext = WebGL2RenderingContext;

export default class WebGLApplication {
  private gl: WebGLContext | null = null;
  private lastTimestamp = 0;

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

  constructor(selector: string) {
    const container = document.querySelector<HTMLElement>(selector);
    if (!container) {
      throw new Error(`Selector '${selector}' is not a valid HTML element`);
    }
    container.innerHTML = `<canvas width="800" height="600" id="webgl-ca011f2b319"></canvas>`;

    const canvas = document.querySelector<HTMLCanvasElement>(`canvas`);
    if (!canvas) {
      throw new Error(`Failed to inject a Canvas element into '${selector}'`);
    }

    this.gl = canvas.getContext(`webgl2`);
    if (this.gl) {
      console.log(`WebGL version ${this.gl.getParameter(this.gl.VERSION)}`);
    } else {
      throw new Error(`Failed to initialize WebGL2`);
    }

    this.gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    this.checkError();
  }

  initialize(callback: (gl: WebGLContext) => void) {
    callback(this.context());
  }

  tick(callback: (gl: WebGLContext, dt: number) => void) {
    const tick = (timestamp: number) => {
      const dt = (timestamp - this.lastTimestamp) / 1000;
      this.lastTimestamp = timestamp;
      callback(this.context(), dt);
      requestAnimationFrame(tick);
      this.checkError();
    };
    requestAnimationFrame(tick);
  }
}
