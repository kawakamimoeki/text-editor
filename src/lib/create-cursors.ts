import { createHiddenTextarea } from "./create-hidden-textarea";
import { Kaku } from "./kaku";
import { selectionRanges } from "./selection-ranges";

export const createCursors = (kaku: Kaku) => {
  kaku.state.selections.forEach((selection) => {
    if (
      selection.visualPosition.toRow === null ||
      selection.visualPosition.toCol === null
    ) {
      return;
    }
    const cursorDiv = document.createElement("div");
    cursorDiv.classList.add("cursor");
    cursorDiv.style.height = `${kaku.settings.lineHeight}px`;
    if (selection.isMain) {
      createHiddenTextarea(kaku, cursorDiv);
    }
    kaku.editor!.append(cursorDiv);

    const selectionDiv = document.createElement("div");
    const ranges = selectionRanges(selection, kaku);
    selectionDiv.classList.add("selection-group");
    kaku.editor!.append(selectionDiv);
    ranges.forEach((range) => {
      const rangeDiv = document.createElement("div");
      rangeDiv.classList.add("selection");
      rangeDiv.style.height = `${kaku.settings.lineHeight}px`;
      rangeDiv.style.width = `${range.width}px`;
      selectionDiv.append(rangeDiv);
    });
  });
};
