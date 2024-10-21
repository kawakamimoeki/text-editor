import { Kaku } from "./kaku";
import { selectionRanges } from "./selection-ranges";

export const updateSelections = (kaku: Kaku) => {
  kaku
    .editor!.querySelectorAll<HTMLDivElement>(".selection-group")
    .forEach((selectionDiv, index) => {
      const selection = kaku.state.selections[index];
      if (
        selection.visualPosition.toRow === null ||
        selection.visualPosition.toCol === null
      ) {
        return;
      }
      const ranges = selectionRanges(selection, kaku);
      selectionDiv.innerHTML = "";
      ranges.forEach((range) => {
        const rangeDiv = document.createElement("div");
        rangeDiv.classList.add("selection");
        rangeDiv.style.height = `${kaku.settings.lineHeight}px`;
        rangeDiv.style.width = `${range.width}px`;
        rangeDiv.style.left = `${kaku.editor!.querySelector(".lines")!.getBoundingClientRect().x - kaku.editor!.getBoundingClientRect().x + range.left}px`;
        rangeDiv.style.top = `${range.top - (kaku.editor!.querySelector(".lines")!.getBoundingClientRect().y - kaku.editor!.getBoundingClientRect().y) - kaku.editor!.scrollTop}px`;
        selectionDiv.append(rangeDiv);
      });
    });
};
