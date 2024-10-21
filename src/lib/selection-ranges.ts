import { Kaku } from "./kaku";
import { Selection } from "./state";

export const selectionRanges = (selection: Selection, kaku: Kaku) => {
  if (
    selection.visualPosition.toCol === null ||
    selection.visualPosition.fromCol === null ||
    selection.visualPosition.toRow === null ||
    selection.visualPosition.fromRow === null
  ) {
    return [];
  }
  const result = [];
  let row = 0;
  for (let line of kaku.state.visualLines) {
    if (
      row === selection.visualPosition.fromRow &&
      row === selection.visualPosition.toRow
    ) {
      result.push({
        top: row * kaku.settings.lineHeight,
        left: kaku.textMeasurement.getTextWidth(
          line.slice(
            0,
            Math.min(
              selection.visualPosition.toCol,
              selection.visualPosition.fromCol,
            ),
          ),
        ),
        width: kaku.textMeasurement.getTextWidth(
          line.slice(
            Math.min(
              selection.visualPosition.fromCol,
              selection.visualPosition.toCol,
            ),
            Math.max(
              selection.visualPosition.toCol,
              selection.visualPosition.fromCol,
            ),
          ),
        ),
      });
    } else if (
      selection.visualPosition.fromRow < selection.visualPosition.toRow
    ) {
      if (row === selection.visualPosition.fromRow) {
        result.push({
          top: row * kaku.settings.lineHeight,
          left: kaku.textMeasurement.getTextWidth(
            line.slice(0, selection.visualPosition.fromCol),
          ),
          width: kaku.textMeasurement.getTextWidth(
            line.slice(selection.visualPosition.fromCol, line.length),
          ),
        });
      } else if (
        row > selection.visualPosition.fromRow &&
        row < selection.visualPosition.toRow
      ) {
        result.push({
          top: row * kaku.settings.lineHeight,
          left: 0,
          width: kaku.textMeasurement.getTextWidth(line),
        });
      } else if (row === selection.visualPosition.toRow) {
        result.push({
          top: row * kaku.settings.lineHeight,
          left: 0,
          width: kaku.textMeasurement.getTextWidth(
            line.slice(0, selection.visualPosition.toCol),
          ),
        });
      }
    } else {
      if (row === selection.visualPosition.toRow) {
        result.push({
          top: row * kaku.settings.lineHeight,
          left: kaku.textMeasurement.getTextWidth(
            line.slice(0, selection.visualPosition.toCol),
          ),
          width: kaku.textMeasurement.getTextWidth(
            line.slice(selection.visualPosition.toCol, line.length),
          ),
        });
      } else if (
        row > selection.visualPosition.toRow &&
        row < selection.visualPosition.fromRow
      ) {
        result.push({
          top: row * kaku.settings.lineHeight,
          left: 0,
          width: kaku.textMeasurement.getTextWidth(line),
        });
      } else if (row === selection.visualPosition.fromRow) {
        result.push({
          top: row * kaku.settings.lineHeight,
          left: 0,
          width: kaku.textMeasurement.getTextWidth(
            line.slice(0, selection.visualPosition.fromCol),
          ),
        });
      }
    }
    row += 1;
  }
  return result;
};
