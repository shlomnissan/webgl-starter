export default class Plane {
  private vertexData: number[] = [];
  private indexData: number[] = [];

  constructor(
    width: number,
    height: number,
    widthSegments: number,
    heightSegments: number
  ) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const gridX = widthSegments;
    const gridY = heightSegments;
    const gridX1 = gridX + 1;
    const gridY1 = gridY + 1;
    const segmentW = width / gridX;
    const segmentH = height / gridY;

    for (let iy = 0; iy < gridY1; ++iy) {
      const y = iy * segmentH - halfHeight;
      for (let ix = 0; ix < gridX1; ++ix) {
        const x = ix * segmentW - halfWidth;
        const u = ix / gridX;
        const v = 1 - iy / gridY;

        this.vertexData.push(x); // pos x
        this.vertexData.push(-y); // pos y
        this.vertexData.push(0); // pos z
        this.vertexData.push(0); // normal x
        this.vertexData.push(0); // normal y
        this.vertexData.push(1); // normal z
        this.vertexData.push(u); // u
        this.vertexData.push(v); // v
      }
    }

    for (let iy = 0; iy < gridY; ++iy) {
      for (let ix = 0; ix < gridX; ++ix) {
        const a = ix + gridX1 * iy;
        const b = ix + gridX1 * (iy + 1);
        const c = ix + 1 + gridX1 * (iy + 1);
        const d = ix + 1 + gridX1 * iy;

        this.indexData.push(a);
        this.indexData.push(b);
        this.indexData.push(d);
        this.indexData.push(b);
        this.indexData.push(c);
        this.indexData.push(d);
      }
    }
  }

  public get vertices() {
    return new Float32Array(this.vertexData);
  }

  public get indices() {
    return new Uint16Array(this.indexData);
  }
}
