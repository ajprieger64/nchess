/*
Creative Commons Attribution
Original work: "Chess_qlt45.svg" by CBurnett
URL: https://commons.wikimedia.org/wiki/File:Chess_qlt45.svg
Original and derivative work licensed under: CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/)
The work has been altered from its original form as an SVG into the code below.
*/

/*
Creative Commons Attribution
Original work: "Chess_qdt45.svg" by CBurnett
URL: https://commons.wikimedia.org/wiki/File:Chess_qdt45.svg
Original and derivative work licensed under: CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/)
Part of the work has been altered from its original form as an SVG into the code below (section 'Dark colors only').
*/

import getPieceColors from "./piece-colors";

export default function drawQueen(
  ctx: CanvasRenderingContext2D,
  player: number
) {
  const pieceColors = getPieceColors(ctx);
  ctx.strokeStyle = pieceColors[player].borderColor;
  ctx.fillStyle = pieceColors[player].interiorColor;
  ctx.lineWidth = 1.5;

  // Crown lines
  ctx.beginPath();
  ctx.moveTo(9.0, 26.0);
  ctx.bezierCurveTo(17.5, 24.5, 30.0, 24.5, 36.0, 26.0);
  ctx.lineTo(38.5, 13.5);
  ctx.lineTo(31.0, 25.0);
  ctx.lineTo(30.7, 10.9);
  ctx.lineTo(25.5, 24.5);
  ctx.lineTo(22.5, 10.0);
  ctx.lineTo(19.5, 24.5);
  ctx.lineTo(14.3, 10.9);
  ctx.lineTo(14.0, 25.0);
  ctx.lineTo(6.5, 13.5);
  ctx.lineTo(9.0, 26.0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Body
  ctx.beginPath();
  ctx.moveTo(9.0, 26.0);
  ctx.bezierCurveTo(9.0, 28.0, 10.5, 28.0, 11.5, 30.0);
  ctx.bezierCurveTo(12.5, 31.5, 12.5, 31.0, 12.0, 33.5);
  ctx.bezierCurveTo(10.5, 34.5, 11.0, 36.0, 11.0, 36.0);
  ctx.bezierCurveTo(9.5, 37.5, 11.0, 38.5, 11.0, 38.5);
  ctx.bezierCurveTo(17.5, 39.5, 27.5, 39.5, 34.0, 38.5);
  ctx.bezierCurveTo(34.0, 38.5, 35.5, 37.5, 34.0, 36.0);
  ctx.bezierCurveTo(34.0, 36.0, 34.5, 34.5, 33.0, 33.5);
  ctx.bezierCurveTo(32.5, 31.0, 32.5, 31.5, 33.5, 30.0);
  ctx.bezierCurveTo(34.5, 28.0, 36.0, 28.0, 36.0, 26.0);
  ctx.bezierCurveTo(27.5, 24.5, 17.5, 24.5, 9.0, 26.0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Ruffles? Not sure what these are supposed to represent
  ctx.beginPath();
  ctx.moveTo(11.5, 30.0);
  ctx.bezierCurveTo(15.0, 29.0, 30.0, 29.0, 33.5, 30.0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(12.0, 33.5);
  ctx.bezierCurveTo(18.0, 32.5, 27.0, 32.5, 33.0, 33.5);
  ctx.stroke();

  // Crown circles
  ctx.beginPath();
  ctx.arc(6.0, 12.0, 2.0, 0.0, 6.28318531, true);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(14.0, 9.0, 2.0, 0.0, 6.28318531, true);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(22.5, 8.0, 2.0, 0.0, 6.28318531, true);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(31.0, 9.0, 2.0, 0.0, 6.28318531, true);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(39.0, 12.0, 2.0, 0.0, 6.28318531, true);
  ctx.fill();
  ctx.stroke();

  if (pieceColors[player].isLight) return;

  // Dark colors only
  // Ruffles
  ctx.strokeStyle = pieceColors[player].highlightColor;

  ctx.beginPath();
  ctx.moveTo(11.0, 29.0);
  ctx.bezierCurveTo(18.44776, 26.409026, 26.55224, 26.409026, 34.0, 29.0);
  ctx.moveTo(12.5, 31.5);
  ctx.lineTo(32.5, 31.5);
  ctx.moveTo(11.5, 34.5);
  ctx.bezierCurveTo(18.642708, 36.864673, 26.357292, 36.864673, 33.5, 34.5);
  ctx.moveTo(10.5, 37.5);
  ctx.bezierCurveTo(18.249973, 40.328581, 26.750027, 40.328581, 34.5, 37.5);
  ctx.stroke();
}
