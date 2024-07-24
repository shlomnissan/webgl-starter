import { WebGLContext } from "./application";
import Mesh from "./mesh";
import ShaderProgram from "./shader_program";

export default class Grid {
    private readonly valuesPerVertex = 6;
    private readonly dimensions: number;
    private readonly mesh: Mesh;
    private idx = 0;
    private data: Float32Array;

    constructor(gl: WebGLContext, dimensions: number) {
        this.dimensions = dimensions;

        const lines = (dimensions + 1) * 2;
        const vertices = lines * 2;
        this.data = new Float32Array(vertices * this.valuesPerVertex);

        this.generateVertices();
        this.mesh = new Mesh(gl, this.data, vertices);
        this.mesh.drawLines();
    }

    public draw(program: ShaderProgram) {
        this.mesh.draw(program);
    }

    private generateVertices() {
        const div = this.dimensions / 2;

        let xOffset = -div;
        for (let i = 0; i <= this.dimensions; ++i) {
            this.addVertex(xOffset, 0.0, -div);
            this.addVertex(xOffset, 0.0, div);
            xOffset += 1;
        }

        let zOffset = -div;
        for (let i = 0; i <= this.dimensions; ++i) {
            this.addVertex(-div, 0.0, zOffset);
            this.addVertex(div, 0.0, zOffset);
            zOffset += 1;
        }
    }

    private addVertex(x: number, y: number, z: number) {
        const color = 0.5;
        this.data[this.idx++] = x;
        this.data[this.idx++] = y;
        this.data[this.idx++] = z;
        this.data[this.idx++] = color; // r
        this.data[this.idx++] = color; // g
        this.data[this.idx++] = color; // b
    }
}