import TinySegmenter from "tiny-segmenter";
import { Kaku } from "../kaku.ts";

export const moveLeft = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    if (selection.to !== selection.from) {
      selection.to = Math.min(selection.to, selection.from);
      selection.from = selection.to;
      selection.visualPosition.currentToLeft = null;
    }
    selection.to = Math.max(0, selection.to - 1);
    selection.from = selection.to;
    return selection;
  });
};

export const selectLeft = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    selection.to = Math.max(0, selection.to - 1);
    selection.visualPosition.currentToLeft = null;
    return selection;
  });
};

export const selectRange = (kaku: Kaku, from: number, to: number) => {
  kaku.state.selections = [
    {
      from,
      to,
      visualPosition: {
        fromRow: null,
        fromCol: null,
        toRow: null,
        toCol: null,
        currentToLeft: null,
      },
      isMain: true,
    },
  ];
};

export const moveRight = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    selection.to = Math.min(kaku.state.content.length, selection.to + 1);
    selection.from = selection.to;
    selection.visualPosition.currentToLeft = null;
    return selection;
  });
};

export const selectRight = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    selection.to = Math.min(kaku.state.content.length, selection.to + 1);
    selection.visualPosition.currentToLeft = null;
    return selection;
  });
};

export const moveToPreviousWord = (kaku: Kaku) => {
  let i = 0;
  let isMoved = kaku.state.selections.map(() => false);
  const segmenter = new TinySegmenter();
  const groups = segmenter.segment(kaku.state.content);

  for (let group of groups) {
    kaku.state.selections = kaku.state.selections.map((selection, index) => {
      if (i + group.length >= selection.to && !isMoved[index]) {
        selection.to = i;
        selection.from = selection.to;
        selection.visualPosition.currentToLeft = null;
        isMoved[index] = true;
      }
      return selection;
    });
    i += group.length;
  }
};

export const selectToPreviousWord = (kaku: Kaku) => {
  let i = 0;
  let isMoved = kaku.state.selections.map(() => false);
  const segmenter = new TinySegmenter();
  const groups = segmenter.segment(kaku.state.content);

  for (let group of groups) {
    kaku.state.selections = kaku.state.selections.map((selection, index) => {
      if (i + group.length >= selection.to && !isMoved[index]) {
        selection.to = i;
        selection.visualPosition.currentToLeft = null;
        isMoved[index] = true;
      }
      return selection;
    });
    i += group.length;
  }
};

export const moveToNextWord = (kaku: Kaku) => {
  let i = 0;
  let isMoved = kaku.state.selections.map(() => false);
  const segmenter = new TinySegmenter();
  const groups = segmenter.segment(kaku.state.content);

  for (let group of groups) {
    kaku.state.selections = kaku.state.selections.map((selection, index) => {
      if (i + group.length > selection.to && !isMoved[index]) {
        selection.to = i + group.length;
        selection.from = selection.to;
        selection.visualPosition.currentToLeft = null;
        isMoved[index] = true;
      }
      return selection;
    });
    i += group.length;
  }
};

export const selectToNextWord = (kaku: Kaku) => {
  let i = 0;
  let isMoved = kaku.state.selections.map(() => false);
  const segmenter = new TinySegmenter();
  const groups = segmenter.segment(kaku.state.content);

  for (let group of groups) {
    kaku.state.selections = kaku.state.selections.map((selection, index) => {
      if (i + group.length > selection.to && !isMoved[index]) {
        selection.to = i + group.length;
        selection.visualPosition.currentToLeft = null;
        isMoved[index] = true;
      }
      return selection;
    });
    i += group.length;
  }
};

export const moveDown = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    if (
      selection.visualPosition.toCol === null ||
      selection.visualPosition.toRow === null
    ) {
      return selection;
    }
    if (selection.visualPosition.toRow === kaku.state.visualLines.length - 1) {
      return selection;
    }
    const currentLeft = kaku.textMeasurement.getTextWidth(
      kaku.state.visualLines[selection.visualPosition.toRow].slice(
        0,
        selection.visualPosition.toCol
      )
    );
    let left = 0;
    let col = 0;
    if (!kaku.state.visualLines[selection.visualPosition.toRow].match(/\s$/)) {
      col += 1;
    }
    for (let char of kaku.state.visualLines[
      selection.visualPosition.toRow + 1
    ].split("")) {
      const w = kaku.textMeasurement.getCharWidth(char);
      if (left + w / 2 > currentLeft) {
        left += w / 2;
        break;
      } else if (left + w > currentLeft) {
        left += w;
        col += 1;
        break;
      }
      left += kaku.textMeasurement.getCharWidth(char);
      col += 1;
    }
    selection.to +=
      kaku.state.visualLines[selection.visualPosition.toRow].length -
      selection.visualPosition.toCol -
      (selection.visualPosition.toCol ===
      kaku.state.visualLines[selection.visualPosition.toRow].length - 1
        ? 1
        : 0) +
      Math.min(
        Math.max(
          1,
          kaku.state.visualLines[selection.visualPosition.toRow + 1].length
        ),
        col
      );
    if (
      selection.visualPosition.toCol >
        kaku.state.visualLines[selection.visualPosition.toRow + 1].length &&
      selection.visualPosition.currentToLeft! < currentLeft
    ) {
      selection.visualPosition.currentToLeft = currentLeft;
    }
    selection.from = selection.to;
    return selection;
  });
};

export const selectDown = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    if (
      selection.visualPosition.toCol === null ||
      selection.visualPosition.toRow === null
    ) {
      return selection;
    }
    if (selection.visualPosition.toRow === kaku.state.visualLines.length - 1) {
      return selection;
    }
    const currentLeft = kaku.textMeasurement.getTextWidth(
      kaku.state.visualLines[selection.visualPosition.toRow].slice(
        0,
        selection.visualPosition.toCol
      )
    );
    let left = 0;
    let col = 0;
    if (!kaku.state.visualLines[selection.visualPosition.toRow].match(/\s$/)) {
      col += 1;
    }
    for (let char of kaku.state.visualLines[
      selection.visualPosition.toRow + 1
    ].split("")) {
      const w = kaku.textMeasurement.getCharWidth(char);
      if (left + w / 2 > currentLeft) {
        break;
      } else if (left + w > currentLeft) {
        col += 1;
        break;
      }
      left += kaku.textMeasurement.getCharWidth(char);
      col += 1;
    }
    selection.to +=
      kaku.state.visualLines[selection.visualPosition.toRow].length -
      selection.visualPosition.toCol -
      (selection.visualPosition.toCol ===
      kaku.state.visualLines[selection.visualPosition.toRow].length - 1
        ? 1
        : 0) +
      Math.min(
        kaku.state.visualLines[selection.visualPosition.toRow + 1].length + 1,
        col
      );
    if (
      selection.visualPosition.toCol >
        kaku.state.visualLines[selection.visualPosition.toRow + 1].length &&
      selection.visualPosition.currentToLeft! < currentLeft
    ) {
      selection.visualPosition.currentToLeft = currentLeft;
    }
    return selection;
  });
};

export const moveUp = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    if (
      selection.visualPosition.toCol === null ||
      selection.visualPosition.toRow === null
    ) {
      return selection;
    }
    if (selection.visualPosition.toRow === 0) {
      return selection;
    }
    const currentLeft = kaku.textMeasurement.getTextWidth(
      kaku.state.visualLines[selection.visualPosition.toRow].slice(
        0,
        selection.visualPosition.toCol
      )
    );
    let left = 0;
    let col = 0;
    if (
      !kaku.state.visualLines[selection.visualPosition.toRow - 1].match(/\s$/)
    ) {
      col -= 1;
    }
    for (let char of kaku.state.visualLines[
      selection.visualPosition.toRow - 1
    ].split("")) {
      const w = kaku.textMeasurement.getCharWidth(char);
      if (left + w / 2 > currentLeft) {
        break;
      } else if (left + w > currentLeft) {
        col += 1;
        break;
      }
      left += w;
      col += 1;
    }
    selection.to =
      selection.to -
      Math.max(
        1,
        kaku.state.visualLines[selection.visualPosition.toRow - 1].length - col
      ) -
      selection.visualPosition.toCol;
    if (
      selection.visualPosition.toCol >
        kaku.state.visualLines[selection.visualPosition.toRow - 1].length &&
      (selection.visualPosition.currentToLeft === null ||
        selection.visualPosition.currentToLeft < currentLeft)
    ) {
      selection.visualPosition.currentToLeft = currentLeft;
    }
    selection.from = selection.to;
    return selection;
  });
};

export const selectUp = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    if (
      selection.visualPosition.toCol === null ||
      selection.visualPosition.toRow === null
    ) {
      return selection;
    }
    if (selection.visualPosition.toRow === 0) {
      return selection;
    }
    const currentLeft = kaku.textMeasurement.getTextWidth(
      kaku.state.visualLines[selection.visualPosition.toRow].slice(
        0,
        selection.visualPosition.toCol
      )
    );
    let left = 0;
    let col = 0;
    if (
      !kaku.state.visualLines[selection.visualPosition.toRow - 1].match(/\s$/)
    ) {
      col -= 1;
    }
    for (let char of kaku.state.visualLines[
      selection.visualPosition.toRow - 1
    ].split("")) {
      const w = kaku.textMeasurement.getCharWidth(char);
      if (left + w / 2 > currentLeft) {
        break;
      } else if (left + w > currentLeft) {
        col += 1;
        break;
      }
      left += kaku.textMeasurement.getCharWidth(char);
      col += 1;
    }
    selection.to =
      selection.to -
      Math.max(
        1,
        kaku.state.visualLines[selection.visualPosition.toRow - 1].length - col
      ) -
      selection.visualPosition.toCol;
    if (
      selection.visualPosition.toCol >
        kaku.state.visualLines[selection.visualPosition.toRow - 1].length &&
      (selection.visualPosition.currentToLeft === null ||
        selection.visualPosition.currentToLeft < currentLeft)
    ) {
      selection.visualPosition.currentToLeft = currentLeft;
    }
    return selection;
  });
};

export const moveToBeginningOfLine = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    if (selection.visualPosition.toCol === null) {
      return selection;
    }
    selection.to = selection.to - selection.visualPosition.toCol;
    selection.from = selection.to;
    selection.visualPosition.currentToLeft = null;
    return selection;
  });
};

export const selectToBeginningOfLine = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    if (selection.visualPosition.toCol === null) {
      return selection;
    }
    selection.to = selection.to - selection.visualPosition.toCol;
    selection.visualPosition.currentToLeft = null;
    return selection;
  });
};

export const moveToEndOfLine = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    if (
      selection.visualPosition.toCol === null ||
      selection.visualPosition.toRow === null
    ) {
      return selection;
    }
    selection.to =
      selection.to +
      kaku.state.visualLines[selection.visualPosition.toRow].length -
      selection.visualPosition.toCol -
      (kaku.state.visualLines[selection.visualPosition.toRow].match(/\s$/)
        ? 1
        : 0);
    selection.from = selection.to;
    selection.visualPosition.currentToLeft = null;
    return selection;
  });
};

export const selectToEndOfLine = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    if (
      selection.visualPosition.toCol === null ||
      selection.visualPosition.toRow === null
    ) {
      return selection;
    }
    selection.to =
      selection.to +
      kaku.state.visualLines[selection.visualPosition.toRow].length -
      selection.visualPosition.toCol -
      (kaku.state.visualLines[selection.visualPosition.toRow].match(/\s$/)
        ? 1
        : 0);
    selection.visualPosition.currentToLeft = null;
    return selection;
  });
};

export const selectAll = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    selection.from = 0;
    selection.to = kaku.state.content.length;
    selection.visualPosition.currentToLeft = null;
    return selection;
  });
};

export const moveToStart = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    selection.to = 0;
    selection.from = selection.to;
    selection.visualPosition.currentToLeft = null;
    return selection;
  });
};

export const moveToEnd = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    selection.from = kaku.state.content.length;
    selection.to = selection.from;
    selection.visualPosition.currentToLeft = null;
    return selection;
  });
};

export const selectToStart = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    selection.to = 0;
    selection.visualPosition.currentToLeft = null;
    return selection;
  });
};

export const selectToEnd = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    selection.to = kaku.state.content.length;
    selection.visualPosition.currentToLeft = null;
    return selection;
  });
};
