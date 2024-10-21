import { cursorPosition } from "./cursor-position";
import { Kaku } from "./kaku";

export const updateCursors = (kaku: Kaku) => {
  kaku
    .editor!.querySelectorAll<HTMLDivElement>(".cursor")
    .forEach((cursor, index) => {
      const selection = kaku.state.selections[index];
      if (
        selection.visualPosition.toRow === null ||
        selection.visualPosition.toCol === null
      ) {
        return;
      }
      const pos = cursorPosition(
        selection.visualPosition.toRow,
        selection.visualPosition.toCol,
        kaku,
      );
      cursor.style.top = `${kaku.editor!.querySelector(".lines")!.getBoundingClientRect().y - kaku.editor!.getBoundingClientRect().y + pos.top + kaku.editor!.scrollTop}px`;
      cursor.style.left = `${kaku.editor!.querySelector(".lines")!.getBoundingClientRect().x - kaku.editor!.getBoundingClientRect().x + pos.left}px`;
      if (kaku.state.move) {
        cursor.classList.add("move");
      }
    });
};
