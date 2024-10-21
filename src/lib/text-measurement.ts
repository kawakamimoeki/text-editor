export class TextMeasurement {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  cache: Map<string, number>;

  constructor(font: string, fontSize: number) {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d")!;
    this.context.font = `${fontSize}px ${font}`;
    this.cache = new Map();
  }

  getCharWidth(char: string): number {
    if (this.cache.has(char)) {
      return this.cache.get(char)!;
    }
    const width = this.context.measureText(char).width;
    this.cache.set(char, width);
    return width;
  }

  getTextWidth(text: string): number {
    return text
      .split("")
      .reduce(
        (accumulator, current) => accumulator + this.getCharWidth(current),
        0,
      );
  }
}
