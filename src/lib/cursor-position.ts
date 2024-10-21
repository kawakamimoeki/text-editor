import { Kaku } from "./kaku";

export const cursorPosition = (row: number, col: number, kaku: Kaku) => {
  if (kaku.state.visualLines.length === 0) {
    return {
      top: 0,
      left: 0,
    };
  }

  return {
    top: row * kaku.settings.lineHeight,
    left: kaku.textMeasurement.getTextWidth(
      kaku.state.visualLines[row].slice(0, col),
    ),
  };
};
