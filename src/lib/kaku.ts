import { Yubi } from "yubi";
import { Settings } from "./settings";
import { State } from "./state";
import { TextMeasurement } from "./text-measurement";

export class Kaku {
  state: State;
  textMeasurement: TextMeasurement;
  settings: Settings;
  editor: HTMLDivElement | null;
  undoHistory: State[];
  redoHistory: State[];
  yubi: Yubi;

  constructor(content: string, settings: Settings) {
    this.yubi = new Yubi();
    this.state = new State(content);
    this.textMeasurement = new TextMeasurement(
      settings.font,
      settings.fontSize,
    );
    this.settings = settings;
    this.editor = null;
    this.undoHistory = [
      { ...this.state, selections: structuredClone(this.state.selections) },
    ];
    this.redoHistory = [];
  }
}
