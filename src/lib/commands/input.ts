import { Kaku } from "../kaku.ts";
import TinySegmenter from "tiny-segmenter";

export const insertText = (kaku: Kaku, text: string) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    if (selection.from <= selection.to) {
      kaku.state.content =
        kaku.state.content.slice(0, selection.from) +
        text +
        kaku.state.content.slice(selection.to);
      selection.from = selection.from + text.length;
      selection.to = selection.from;
      return selection;
    } else {
      kaku.state.content =
        kaku.state.content.slice(0, selection.to) +
        text +
        kaku.state.content.slice(selection.from);
      selection.from = selection.to + text.length;
      selection.to = selection.from;
      return selection;
    }
  });
};

export const deleteCharBackward = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    if (selection.from === 0 && selection.to === 0) {
      return selection;
    }
    if (selection.from === selection.to) {
      kaku.state.content =
        kaku.state.content.slice(0, selection.to - 1) +
        kaku.state.content.slice(selection.to);
      selection.to = selection.to - 1;
    } else {
      kaku.state.content =
        kaku.state.content.slice(0, Math.min(selection.from, selection.to)) +
        kaku.state.content.slice(Math.max(selection.from, selection.to));
      selection.to = Math.min(selection.from, selection.to);
    }
    selection.from = selection.to;
    return selection;
  });
};

export const deleteToBeginningOfLine = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    if (!selection.visualPosition.toCol) {
      return selection;
    }
    kaku.state.content =
      kaku.state.content.slice(
        0,
        selection.to - selection.visualPosition.toCol,
      ) + kaku.state.content.slice(selection.to);
    selection.to = selection.to - selection.visualPosition.toCol;
    selection.from = selection.to;
    return selection;
  });
};

export const deleteToPreviousWord = (kaku: Kaku) => {
  let i = 0;
  let isMoved = kaku.state.selections.map(() => false);
  const segmenter = new TinySegmenter();
  const groups = segmenter.segment(kaku.state.content);

  for (let group of groups) {
    kaku.state.selections = kaku.state.selections.map((selection, index) => {
      if (i + group.length >= selection.to && !isMoved[index]) {
        kaku.state.content =
          kaku.state.content.slice(0, i) +
          kaku.state.content.slice(selection.to);
        selection.to = i;
        selection.from = selection.to;
        isMoved[index] = true;
      }
      return selection;
    });
    i += group.length;
  }
};

export const indentLess = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    let matchIndent: RegExpMatchArray | null = null;
    kaku.state.content = kaku.state.content
      .split(kaku.settings.lineSeparator)
      .map((l, i) => {
        if (selection.visualPosition.fromRow === i) {
          matchIndent = l.match(new RegExp(`^${kaku.settings.indentUnit}(.*)`));
          return l.replace(
            new RegExp(`^${kaku.settings.indentUnit}(.*)`),
            "$1",
          );
        } else {
          return l;
        }
      })
      .join(kaku.settings.lineSeparator);
    if (matchIndent) {
      selection.to = selection.to - kaku.settings.indentUnit.length;
      selection.from = selection.to;
    }
    return selection;
  });
  return kaku.state;
};

export const indentMore = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    kaku.state.content = kaku.state.content
      .split(kaku.settings.lineSeparator)
      .map((l, i) => {
        if (selection.visualPosition.toRow === i) {
          return kaku.settings.indentUnit + l;
        } else {
          return l;
        }
      })
      .join(kaku.settings.lineSeparator);
    selection.to = selection.to + kaku.settings.indentUnit.length;
    selection.from = selection.to;
    return selection;
  });
  return kaku.state;
};

export const splitLine = (kaku: Kaku) => {
  kaku.state.selections = kaku.state.selections.map((selection) => {
    kaku.state.content =
      kaku.state.content.slice(0, selection.to) +
      kaku.settings.lineSeparator +
      kaku.state.content.slice(selection.from);
    selection.to += kaku.settings.lineSeparator.length;
    selection.from = selection.to;
    return selection;
  });
};
