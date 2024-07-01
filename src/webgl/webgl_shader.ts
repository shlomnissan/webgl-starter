import { WebGLContext } from "./webgl_application";

export default function WebGLShader(gl: WebGLContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) {
        throw new Error(`Failed to create a new shader of type ${type}`);
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(`Error compiling shader: ${message}`);
    }

    return shader;
}