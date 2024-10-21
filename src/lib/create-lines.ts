import { calculate } from "./calculate";
import { dragCursor } from "./drag-cursor";
import { dropCursor } from "./drop-cursor";
import { Kaku } from "./kaku";
import { updateCursors } from "./update-cursors";
import { updateSelections } from "./update-selections";

export const createLines = (kaku: Kaku) => {
  const { gutters, lines } = createLinesDiv(kaku);
  kaku.editor?.append(gutters);
  kaku.editor?.append(lines);
};

export const createLinesDiv = (kaku: Kaku) => {
  const gutters = document.createElement("div");
  gutters.classList.add("gutters");
  const lines = document.createElement("div");
  lines.classList.add("lines");
  let visualLineIndex = 0;
  calculate(kaku);
  let mousedown = false;
  lines.addEventListener("mousedown", (e) => {
    mousedown = true;
    if (e.shiftKey) {
      dragCursor(kaku, {
        x: e.offsetX,
        y: e.clientY - lines.getBoundingClientRect().y,
      });
    } else {
      dropCursor(kaku, {
        x: e.offsetX,
        y: e.clientY - lines.getBoundingClientRect().y,
      });
    }
    calculate(kaku);
    updateCursors(kaku);
    updateSelections(kaku);
  });
  document.addEventListener("mouseup", () => {
    mousedown = false;
  });
  lines.addEventListener("mousemove", (e) => {
    if (!mousedown) {
      return;
    }
    dragCursor(kaku, {
      x: e.offsetX,
      y: e.clientY - lines.getBoundingClientRect().y,
    });
    calculate(kaku);
    updateCursors(kaku);
    updateSelections(kaku);
  });

  kaku.state.content
    .split(kaku.settings.lineSeparator)
    .forEach((line, index) => {
      let i = 0;
      const gutter = document.createElement("div");
      gutter.classList.add("gutter");
      gutter.innerText = String(index);
      const lineDiv = document.createElement("div");
      lineDiv.classList.add("line");
      lines.append(lineDiv);
      gutters.append(gutter);
      let gutterHeight = 0;
      if (line.length === 0) {
        visualLineIndex += 1;
        const visualLineDiv = document.createElement("div");
        visualLineDiv.classList.add("visual-line");
        visualLineDiv.style.minHeight = `${kaku.settings.lineHeight}px`;
        lineDiv.append(visualLineDiv);
        gutter.style.height = `${kaku.settings.lineHeight}px`;
        return;
      }
      while (1) {
        if (kaku.state.visualLines[visualLineIndex] === undefined) {
          break;
        }
        if (i + kaku.state.visualLines[visualLineIndex].length > line.length) {
          break;
        }
        if (i !== 0 && kaku.state.visualLines[visualLineIndex].length === 0) {
          break;
        }
        gutterHeight += kaku.settings.lineHeight;
        const visualLineDiv = document.createElement("div");
        visualLineDiv.classList.add("visual-line");
        visualLineDiv.style.minHeight = `${kaku.settings.lineHeight}px`;
        visualLineDiv.innerText = kaku.state.visualLines[visualLineIndex];
        lineDiv.append(visualLineDiv);
        i += kaku.state.visualLines[visualLineIndex].length;
        visualLineIndex += 1;
      }

      if (
        i + kaku.state.visualLines[visualLineIndex]?.length <= line.length &&
        lineDiv.innerHTML === ""
      ) {
        const visualLineDiv = document.createElement("div");
        visualLineDiv.classList.add("visual-line");
        visualLineDiv.style.minHeight = `${kaku.settings.lineHeight}px`;
        lineDiv.append(visualLineDiv);
        gutterHeight += kaku.settings.lineHeight;
        return;
      }

      gutter.style.height = `${gutterHeight}px`;
    });
  return { gutters, lines };
};
