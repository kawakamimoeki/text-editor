import { execCommand } from "./exec-command";
import { calculate } from "./calculate";
import { insertText } from "./commands/input";
import { updateCursors } from "./update-cursors";
import { updateSelections } from "./update-selections";
import { Kaku } from "./kaku";
import { selectRange } from "./commands/cursor";
import morphdom from "morphdom";
import { createLinesDiv } from "./create-lines";

export const createHiddenTextarea = (kaku: Kaku, selection: HTMLDivElement) => {
  const textarea = document.createElement("textarea");
  textarea.classList.add("hidden-input");
  textarea.style.marginTop = `${kaku.settings.lineHeight / 2}px`;
  textarea.style.resize = "none";
  selection.append(textarea);
  textarea.focus();
  textarea.addEventListener("keyup", () => {
    kaku
      .editor!.querySelectorAll<HTMLDivElement>(".cursor")
      .forEach((cursor) => cursor.classList.remove("move"));
  });
  kaku.editor!.addEventListener("focus", () => {
    textarea.focus();
  });
  let isComposing = false;
  let composingStartPos: number | null = null;
  let lastComposingText = "";
  textarea.addEventListener("compositionstart", () => {
    if (isComposing) {
      return;
    }
    isComposing = true;
    composingStartPos = kaku.state.selections.find((s) => s.isMain)!.to;
  });
  textarea.addEventListener("input", () => {
    if (kaku.yubi.match("meta+v")) {
      textarea.value = "";
      return;
    }
    if (isComposing) {
      selectRange(
        kaku,
        composingStartPos!,
        composingStartPos! + lastComposingText.length,
      );
      insertText(kaku, textarea.value);
      selectRange(
        kaku,
        composingStartPos! + textarea.value.length,
        composingStartPos! + textarea.value.length,
      );
      lastComposingText = textarea.value;
      calculate(kaku);
    } else if (!kaku.yubi.match("Enter")) {
      insertText(kaku, textarea.value);
      textarea.value = "";
      calculate(kaku);
    }
    if (!isComposing && kaku.yubi.match("Enter")) {
      textarea.value = "";
      return;
    }
    const { lines } = createLinesDiv(kaku);
    morphdom(kaku.editor?.querySelector(".lines")!, lines);
    updateCursors(kaku);
    updateSelections(kaku);
  });
  textarea.addEventListener("keyup", () => {
    if (kaku.yubi.match("meta+z") || kaku.yubi.match("shift+meta+z")) {
      return;
    }
    if (
      kaku.undoHistory[kaku.undoHistory.length - 1]?.content ===
      kaku.state.content
    ) {
      return;
    }
    kaku.undoHistory.push({
      ...kaku.state,
      selections: structuredClone(kaku.state.selections),
    });
  });
  textarea.addEventListener("keydown", async (e: KeyboardEvent) => {
    kaku.state.move = true;
    kaku.yubi.record(e);
    const previousContent = kaku.state.content;
    if (!isComposing) {
      await execCommand(e, kaku);
    }
    if (isComposing && kaku.yubi.match("Enter")) {
      isComposing = false;
      lastComposingText = "";
      textarea.value = "";
    }
    calculate(kaku);
    updateCursors(kaku);
    updateSelections(kaku);
    if (
      kaku.editor!.querySelector(".cursor")!.getBoundingClientRect().y -
        kaku.editor!.getBoundingClientRect().y >
      kaku.editor!.clientHeight - kaku.settings.lineHeight
    ) {
      if (kaku.yubi.match("down")) {
        kaku.editor!.scrollTop += kaku.settings.lineHeight;
      } else {
        kaku.editor!.scrollTop = kaku.editor!.scrollHeight;
      }
    }
    if (
      kaku.editor!.querySelector(".cursor")!.getBoundingClientRect().y -
        kaku.editor!.getBoundingClientRect().y <
      0
    ) {
      if (kaku.yubi.match("up")) {
        kaku.editor!.scrollTop -= kaku.settings.lineHeight;
      } else {
        kaku.editor!.scrollTop = 0;
      }
    }
    if (previousContent === kaku.state.content) {
      return;
    }
    const { lines, gutters } = createLinesDiv(kaku);
    morphdom(kaku.editor?.querySelector(".lines")!, lines);
    morphdom(kaku.editor?.querySelector(".gutters")!, gutters);
  });
};
