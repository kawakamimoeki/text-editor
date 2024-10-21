import { Kaku } from "./kaku.ts";
import { LineBreaker } from "css-line-break";

export const calculate = (kaku: Kaku) => {
  const lines: string[] = [];
  let row = 0;
  let i = 0;
  let isVisualFromSetted = kaku.state.selections.map(() => false);
  let isVisualToSetted = kaku.state.selections.map(() => false);

  kaku.state.content.split(kaku.settings.lineSeparator).forEach((line) => {
    const breaker = LineBreaker(line, {
      lineBreak: "normal",
      wordBreak: "normal",
    });
    let bk;
    let visualLine = "";
    let x = 0;

    while (1) {
      bk = breaker.next();
      kaku.state.selections = kaku.state.selections.map((selection, index) => {
        if (
          (i + visualLine.length > selection.from ||
            (!visualLine.match(/\s$/) &&
              i +
                visualLine.length ===
                selection.to)) &&
          !isVisualFromSetted[index]
        ) {
          selection.visualPosition.fromRow = row;
          selection.visualPosition.fromCol = selection.from - i;
          isVisualFromSetted[index] = true;
        }

        if (
          (i + visualLine.length > selection.to ||
            (!visualLine.match(/\s$/) &&
              i +
                visualLine.length ===
                selection.to)) &&
          !isVisualToSetted[index]
        ) {
          const currentRow = selection.visualPosition.toRow;
          selection.visualPosition.toRow = row;
          if (
            kaku.state.visualLines.length > 0 &&
            selection.visualPosition.currentToLeft !== null &&
            currentRow !== row
          ) {
            let col = 0;
            let left = 0;
            for (let char of kaku.state.visualLines[
              selection.visualPosition.toRow
            ].split("")) {
              const w = kaku.textMeasurement.getCharWidth(char);
              if (left + w / 2 > selection.visualPosition.currentToLeft) {
                left += w / 2;
                break;
              } else if (left + w > selection.visualPosition.currentToLeft) {
                left += w;
                col += 1;
                break;
              }
              left += kaku.textMeasurement.getCharWidth(char);
              col += 1;
            }
            const currentFrom = selection.from;
            const currentTo = selection.to;
            selection.visualPosition.toCol = Math.min(
              kaku.state.visualLines[selection.visualPosition.toRow]?.length,
              col
            );
            selection.to += selection.visualPosition.toCol - (selection.to - i);
            if (currentFrom === currentTo) {
              selection.visualPosition.fromRow = row;
              selection.visualPosition.fromCol = selection.visualPosition.toCol;
              isVisualFromSetted[index] = true;
              selection.from = selection.to;
            }
          } else {
            selection.visualPosition.toCol = selection.to - i;
          }
          isVisualToSetted[index] = true;
        }

        return selection;
      });
      if (bk.done) {
        lines.push(visualLine);
        row += 1;
        i += visualLine.length + 1;
        visualLine = "";
        break;
      }
      const word = bk.value.slice();

      if (
        kaku.editor!.querySelector(".lines") &&
        kaku.textMeasurement.getTextWidth(visualLine + word) >
          kaku.editor!.querySelector(".lines")!.getBoundingClientRect().width
      ) {
        row += 1;
        lines.push(visualLine);
        i += visualLine.length;
        visualLine = "";
      }

      visualLine += word;
    }
    x += visualLine.length;
  });

  kaku.state.visualLines = lines;
};
