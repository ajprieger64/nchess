const white = "rgb(255, 255, 255)";
const black = "rgb(0, 0, 0)";
const gray = "rgb(125, 125, 125)";
const darkGray = "rgb(70, 70, 70)";
const red = "rgb(255, 0, 0)";
const darkRed = "rgb(100, 0, 0)";
const green = "rgb(0, 255, 0)";
const darkGreen = "rgb(0, 100, 0)";
const blue = "rgb(0, 0, 255)";
const darkBlue = "rgb(0, 0, 100)";
const yellow = "rgb(255, 255, 0)";
const darkYellow = "rgb(100, 100, 0)";
const cyan = "rgb(0, 255, 255)";
const darkCyan = "rgb(0, 100, 100)";
const purple = "rgb(255, 0, 255)";
const darkPurple = "rgb(100, 0, 100)";

const goodColorsArray = [
  [true, white] as const,
  [false, black] as const,
  [true, red] as const,
  [false, darkRed] as const,
  [true, green] as const,
  [false, darkGreen] as const,
  [true, blue] as const,
  [false, darkBlue] as const,
  [true, yellow] as const,
  [false, darkYellow] as const,
  [true, cyan] as const,
  [false, darkCyan] as const,
  [true, purple] as const,
  [false, darkPurple] as const,
  [true, gray] as const,
  [false, darkGray] as const,
];

export default function getPieceColors(ctx: CanvasRenderingContext2D) {
  return goodColorsArray.map((colorArray) => {
    const colors = {
      isLight: colorArray[0],
      interiorColor: colorArray[1],
      highlightColor: colorArray[0] ? black : white,
      borderColor: colorArray[0] ? black : colorArray[1],
    };
    return colors;
  });
}
