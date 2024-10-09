/*
Creative Commons Attribution
Original work: "Chess_rlt45.svg" by CBurnett
URL: https://commons.wikimedia.org/wiki/File:Chess_rlt45.svg
Original and derivative work licensed under: CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/)
The work has been altered from its original form as an SVG into the code below.
*/

import getPieceColors from "./piece-colors";

export default function drawRook(
  ctx: CanvasRenderingContext2D,
  player: number
) {
  const pieceColors = getPieceColors(ctx);
  ctx.strokeStyle = pieceColors[player].borderColor;
  ctx.fillStyle = pieceColors[player].interiorColor;
  ctx.lineWidth = 1.5;

  // Base
  ctx.beginPath();
  ctx.moveTo(9.0, 39.0);
  ctx.lineTo(36.0, 39.0);
  ctx.lineTo(36.0, 36.0);
  ctx.lineTo(9.0, 36.0);
  ctx.lineTo(9.0, 39.0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Second-from-bottom
  ctx.beginPath();
  ctx.moveTo(12.0, 36.0);
  ctx.lineTo(12.0, 32.0);
  ctx.lineTo(33.0, 32.0);
  ctx.lineTo(33.0, 36.0);
  ctx.lineTo(12.0, 36.0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Third-from-bottom
  ctx.beginPath();
  ctx.moveTo(31.0, 29.5);
  ctx.lineTo(32.5, 32.0);
  ctx.lineTo(12.5, 32.0);
  ctx.lineTo(14.0, 29.5);
  ctx.fill();
  ctx.stroke();

  // Center portion
  ctx.beginPath();
  ctx.moveTo(31.0, 17.0);
  ctx.lineTo(31.0, 29.5);
  ctx.lineTo(14.0, 29.5);
  ctx.lineTo(14.0, 17.0);
  ctx.fill();
  ctx.stroke();

  // Second-from-top
  ctx.beginPath();
  ctx.moveTo(34.0, 14.0);
  ctx.lineTo(31.0, 17.0);
  ctx.lineTo(14.0, 17.0);
  ctx.lineTo(11.0, 14.0);
  ctx.fill();
  ctx.stroke();

  // Crenellation divider
  ctx.beginPath();
  ctx.moveTo(11.0, 14.0);
  ctx.lineTo(34.0, 14.0);
  ctx.stroke();

  // Crenellations
  ctx.beginPath();
  ctx.moveTo(11.0, 14.0);
  ctx.lineTo(11.0, 9.0);
  ctx.lineTo(15.0, 9.0);
  ctx.lineTo(15.0, 11.0);
  ctx.lineTo(20.0, 11.0);
  ctx.lineTo(20.0, 9.0);
  ctx.lineTo(25.0, 9.0);
  ctx.lineTo(25.0, 11.0);
  ctx.lineTo(30.0, 11.0);
  ctx.lineTo(30.0, 9.0);
  ctx.lineTo(34.0, 9.0);
  ctx.lineTo(34.0, 14.0);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = pieceColors[player].highlightColor;

  // Highlights
  ctx.beginPath();
  ctx.moveTo(36.0, 36.0);
  ctx.lineTo(9.0, 36.0);
  ctx.moveTo(12.0, 32.0);
  ctx.lineTo(33.0, 32.0);
  ctx.moveTo(31.0, 29.5);
  ctx.lineTo(14.0, 29.5);
  ctx.moveTo(34.0, 14.0);
  ctx.lineTo(11.0, 14.0);
  ctx.moveTo(31.0, 17.0);
  ctx.lineTo(14.0, 17.0);
  ctx.stroke();
}
