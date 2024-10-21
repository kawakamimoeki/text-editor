import { Kaku } from "../kaku";

export const undo = (kaku: Kaku) => {
  if (kaku.undoHistory.length < 2) {
    return;
  }
  const current = kaku.undoHistory.pop()!;
  kaku.redoHistory.push({
    ...current,
    selections: structuredClone(current.selections),
  });
  kaku.state = kaku.undoHistory.pop()!;
  kaku.undoHistory.push({
    ...kaku.state,
    selections: structuredClone(kaku.state.selections),
  });
};

export const redo = (kaku: Kaku) => {
  if (kaku.redoHistory.length === 0) {
    return;
  }
  kaku.state = kaku.redoHistory.pop()!;
  kaku.undoHistory.push({
    ...kaku.state,
    selections: structuredClone(kaku.state.selections),
  });
};
