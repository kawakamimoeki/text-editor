import {
  moveDown,
  moveLeft,
  moveRight,
  moveToBeginningOfLine,
  moveToEnd,
  moveToEndOfLine,
  moveToNextWord,
  moveToPreviousWord,
  moveToStart,
  moveUp,
  selectAll,
  selectDown,
  selectLeft,
  selectRight,
  selectToBeginningOfLine,
  selectToEnd,
  selectToEndOfLine,
  selectToNextWord,
  selectToPreviousWord,
  selectToStart,
  selectUp,
} from "./commands/cursor";
import {
  deleteCharBackward,
  deleteToBeginningOfLine,
  deleteToPreviousWord,
  indentLess,
  indentMore,
  insertText,
  splitLine,
} from "./commands/input";
import { Kaku } from "./kaku";
import { redo, undo } from "./commands/history";

export const execCommand = async (event: Event, kaku: Kaku) => {
  if (kaku.yubi.match("left")) {
    moveLeft(kaku);
  } else if (kaku.yubi.match("shift+left")) {
    selectLeft(kaku);
  } else if (kaku.yubi.match("meta+left")) {
    moveToBeginningOfLine(kaku);
  } else if (kaku.yubi.match("meta+shift+left")) {
    selectToBeginningOfLine(kaku);
  } else if (kaku.yubi.match("alt+left")) {
    moveToPreviousWord(kaku);
  } else if (kaku.yubi.match("alt+shift+left")) {
    selectToPreviousWord(kaku);
  }
  if (kaku.yubi.match("right")) {
    moveRight(kaku);
  } else if (kaku.yubi.match("shift+right")) {
    selectRight(kaku);
  } else if (kaku.yubi.match("meta+right")) {
    moveToEndOfLine(kaku);
  } else if (kaku.yubi.match("meta+shift+right")) {
    selectToEndOfLine(kaku);
  } else if (kaku.yubi.match("alt+right")) {
    moveToNextWord(kaku);
  } else if (kaku.yubi.match("alt+shift+right")) {
    selectToNextWord(kaku);
  }
  if (kaku.yubi.match("up")) {
    moveUp(kaku);
  } else if (kaku.yubi.match("shift+up")) {
    selectUp(kaku);
  } else if (kaku.yubi.match("alt+up")) {
    moveUp(kaku);
  } else if (kaku.yubi.match("shift+alt+up")) {
    selectUp(kaku);
  } else if (kaku.yubi.match("shift+meta+up")) {
    selectToStart(kaku);
  } else if (kaku.yubi.match("meta+up")) {
    moveToStart(kaku);
  }
  if (kaku.yubi.match("down")) {
    moveDown(kaku);
  } else if (kaku.yubi.match("shift+down")) {
    selectDown(kaku);
  } else if (kaku.yubi.match("alt+down")) {
    moveDown(kaku);
  } else if (kaku.yubi.match("shift+alt+down")) {
    selectDown(kaku);
  } else if (kaku.yubi.match("shift+meta+down")) {
    selectToEnd(kaku);
  } else if (kaku.yubi.match("meta+down")) {
    moveToEnd(kaku);
  }
  if (kaku.yubi.match("Escape")) {
    kaku.editor!.blur();
  }
  if (kaku.yubi.match("Enter")) {
    splitLine(kaku);
  }
  if (kaku.yubi.match("Backspace")) {
    deleteCharBackward(kaku);
  } else if (kaku.yubi.match("alt+Backspace")) {
    deleteToPreviousWord(kaku);
  } else if (kaku.yubi.match("meta+Backspace")) {
    deleteToBeginningOfLine(kaku);
  }
  if (kaku.yubi.match("meta+z")) {
    undo(kaku);
  } else if (kaku.yubi.match("shift+meta+z")) {
    redo(kaku);
    event.preventDefault();
  }
  if (kaku.yubi.match("meta+a")) {
    selectAll(kaku);
  }
  if (kaku.yubi.match("meta+c")) {
    const textarea =
      kaku.editor!.querySelector<HTMLTextAreaElement>(".hidden-input")!;
    kaku.state.move = true;
    const text = kaku.state.selections
      .map((selection) => {
        return kaku.state.content.slice(
          Math.min(selection.to, selection.from),
          Math.max(selection.from, selection.to)
        );
      })
      .join(kaku.settings.lineSeparator);
    textarea.value = text;
    textarea.focus();
    textarea.select();
  }
  if (kaku.yubi.match("meta+x")) {
    const textarea =
      kaku.editor!.querySelector<HTMLTextAreaElement>(".hidden-input")!;
    kaku.state.move = true;
    const text = kaku.state.selections
      .map((selection) => {
        return kaku.state.content.slice(
          Math.min(selection.to, selection.from),
          Math.max(selection.from, selection.to)
        );
      })
      .join(kaku.settings.lineSeparator);
    deleteCharBackward(kaku);
    textarea.value = text;
    textarea.focus();
    textarea.select();
  }
  if (kaku.yubi.match("meta+v")) {
    const text = await navigator.clipboard.readText();
    insertText(kaku, text);
  }
  if (kaku.yubi.match("Tab")) {
    event.preventDefault();
    kaku.state.move = true;
    if (
      kaku.state.selections.length === 0 &&
      kaku.state.selections[0].visualPosition.toCol &&
      kaku.state.selections[0].visualPosition.toCol > 0
    ) {
      indentMore(kaku);
    } else {
      insertText(kaku, kaku.settings.tabUnit);
    }
  } else if (kaku.yubi.match("shift+Tab")) {
    indentLess(kaku);
  }
};
