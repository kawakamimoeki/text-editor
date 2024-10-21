import { Kaku } from "./kaku";
import { resizeObserver } from "./resize-observer";

export const createEditor = (element: HTMLElement, kaku: Kaku): void => {
  const editor = document.createElement("div");
  editor.role = "textbox";
  editor.tabIndex = 0;
  editor.classList.add("editor");
  editor.style.fontFamily = kaku.settings.font;
  editor.style.lineHeight = `${kaku.settings.lineHeight}px`;
  editor.style.fontSize = `${kaku.settings.fontSize}px`;
  resizeObserver(kaku).observe(editor);
  element.append(editor);

  kaku.editor = editor;
};
