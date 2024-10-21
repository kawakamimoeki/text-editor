import { calculate } from "./calculate";
import { createEditor } from "./create-editor";
import { createLines } from "./create-lines";
import { createCursors } from "./create-cursors";
import { Kaku } from "./kaku";

export const mount = (
  content: string,
  element: HTMLElement | null,
  settings: any = {
    font: "monospace",
    lineHeight: 24,
    fontSize: 16,
    indentUnit: "  ",
    tabUnit: "  ",
    lineSeparator: "\n",
  },
) => {
  if (!element) {
    return null;
  }
  const kaku = new Kaku(content, {
    font: "monospace",
    lineHeight: 24,
    fontSize: 16,
    indentUnit: "  ",
    tabUnit: "  ",
    lineSeparator: "\n",
    ...settings,
  });
  createEditor(element, kaku);
  calculate(kaku);
  createLines(kaku);
  createCursors(kaku);
  return kaku.state;
};
