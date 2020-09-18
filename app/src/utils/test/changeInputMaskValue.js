import TestUtils from "react-dom/test-utils";

export const changeInputMaskValue = (element, value) => {
  element.value = value;
  element.selectionStart = element.selectionEnd = value.length;
  TestUtils.Simulate.change(element);
  TestUtils.Simulate.keyUp(element, { key: "Enter", keyCode: 13, which: 13 });
};
