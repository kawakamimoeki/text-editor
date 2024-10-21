import morphdom from "morphdom";
import { calculate } from "./calculate";
import { createLinesDiv } from "./create-lines";
import { Kaku } from "./kaku";
import { updateCursors } from "./update-cursors";
import { updateSelections } from "./update-selections";
export const resizeObserver = (kaku: Kaku) => {
  return new ResizeObserver((entries) => {
    for (const _ of entries) {
      calculate(kaku);
      updateCursors(kaku);
      updateSelections(kaku);
      const { lines, gutters } = createLinesDiv(kaku);
      morphdom(kaku.editor?.querySelector(".lines")!, lines);
      morphdom(kaku.editor?.querySelector(".gutters")!, gutters);
    }
  });
};
