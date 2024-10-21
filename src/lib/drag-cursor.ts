import { Kaku } from "./kaku.ts";

export const dragCursor = (kaku: Kaku, position: { x: number; y: number }) => {
  let x = 0;
  let y = 0;
  let index = 0;
  let logicalLineIndex = 1;

  for (let i = 0; i < kaku.state.visualLines.length; i++) {
    y += kaku.settings.lineHeight;
    if (y > position.y) {
      for (let j = 0; j <= kaku.state.visualLines[i].length; j++) {
        const width = kaku.textMeasurement.getCharWidth(
          kaku.state.visualLines[i][j],
        );
        if (x + width > position.x) {
          kaku.state.selections.find((s) => s.isMain)!.to = index;
          return;
        }
        if (x + width / 2 > position.x) {
          kaku.state.selections.find((s) => s.isMain)!.to = index - 1;
          return;
        } else {
          if (j === kaku.state.visualLines[i].length) {
            kaku.state.selections.find((s) => s.isMain)!.to = index;
            return;
          }
          index += 1;
          x += width;
        }
      }
    } else {
      index += kaku.state.visualLines[i].length;
      if (
        kaku.state.content
          .split(kaku.settings.lineSeparator)
          .slice(0, logicalLineIndex)
          .join().length === index
      ) {
        index += 1;
        logicalLineIndex += 1;
      }
      if (i === kaku.state.visualLines.length - 1) {
        kaku.state.selections.find((s) => s.isMain)!.to = index;
        return;
      }
    }
  }

  kaku.state.selections.find((s) => s.isMain)!.to = kaku.state.content.length;
  return;
};
