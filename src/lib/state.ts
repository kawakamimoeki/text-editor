export interface Position {
  fromRow: number | null;
  fromCol: number | null;
  toRow: number | null;
  toCol: number | null;
  currentToLeft: number | null;
}

export interface Selection {
  from: number;
  to: number;
  visualPosition: Position;
  isMain: boolean;
}

export class State {
  content: string;
  selections: Selection[];
  visualLines: string[];
  move: boolean;

  constructor(content: string) {
    this.content = content;
    this.selections = [
      {
        from: 0,
        to: 0,
        visualPosition: {
          fromRow: 0,
          fromCol: 0,
          toRow: 0,
          toCol: 0,
          currentToLeft: 0,
        },
        isMain: true,
      },
    ];
    this.visualLines = [];
    this.move = false;
  }
}
