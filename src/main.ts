import './style.css'

import { WebGLApplication, WebGLContext } from './webgl/webgl_application'

const app = new WebGLApplication("#window");

app.initialize((_: WebGLContext) => {
  // TODO: initalize webgl application  
});

app.tick((gl: WebGLContext, _: number) => {
  gl.clearColor(0.0, 0.0, 0.5, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // TODO: update/draw
});