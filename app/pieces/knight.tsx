/*
Creative Commons Attribution
Original work: "Chess_nlt45.svg" by CBurnett
URL: https://commons.wikimedia.org/wiki/File:Chess_nlt45.svg
Original and derivative work licensed under: CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/)
The work has been altered from its original form as an SVG into the code below.
*/

import getPieceColors from "./piece-colors";

/*
Creative Commons Attribution
Original work: "Chess_ndt45.svg" by CBurnett
URL: https://commons.wikimedia.org/wiki/File:Chess_ndt45.svg
Original and derivative work licensed under: CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/)
Part of the work has been altered from its original form as an SVG into the code below (section 'Dark colors only').
*/

export default function drawKnight(
  ctx: CanvasRenderingContext2D,
  player: number
) {
  const pieceColors = getPieceColors(ctx);
  ctx.strokeStyle = pieceColors[player].borderColor;
  ctx.fillStyle = pieceColors[player].interiorColor;
  ctx.lineWidth = 1.5;

  // Body
  ctx.beginPath();
  ctx.moveTo(22.0, 10.0);
  ctx.bezierCurveTo(32.5, 11.0, 38.5, 18.0, 38.0, 39.0);
  ctx.lineTo(15.0, 39.0);
  ctx.bezierCurveTo(15.0, 30.0, 25.0, 32.5, 23.0, 18.0);
  ctx.fill();
  ctx.stroke();

  // Head
  ctx.beginPath();
  ctx.moveTo(24.0, 18.0);
  ctx.bezierCurveTo(24.38, 20.91, 18.45, 25.37, 16.0, 27.0);
  ctx.bezierCurveTo(13.0, 29.0, 13.18, 31.34, 11.0, 31.0);
  ctx.bezierCurveTo(9.958, 30.06, 12.41, 27.96, 11.0, 28.0);
  ctx.bezierCurveTo(10.0, 28.0, 11.19, 29.23, 10.0, 30.0);
  ctx.bezierCurveTo(9.0, 30.0, 5.997, 31.0, 6.0, 26.0);
  ctx.bezierCurveTo(6.0, 24.0, 12.0, 14.0, 12.0, 14.0);
  ctx.bezierCurveTo(12.0, 14.0, 13.89, 12.1, 14.0, 10.5);
  ctx.bezierCurveTo(13.27, 9.506, 13.5, 8.5, 13.5, 7.5);
  ctx.bezierCurveTo(14.5, 6.5, 16.5, 10.0, 16.5, 10.0);
  ctx.lineTo(18.5, 10.0);
  ctx.bezierCurveTo(18.5, 10.0, 19.28, 8.008, 21.0, 7.0);
  ctx.bezierCurveTo(22.0, 7.0, 22.0, 10.0, 22.0, 10.0);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = pieceColors[player].highlightColor;
  ctx.strokeStyle = pieceColors[player].highlightColor;
  // Nose
  ctx.beginPath();
  ctx.moveTo(9.5, 25.5);
  ctx.bezierCurveTo(9.5, 25.678633, 9.404701, 25.843696, 9.25, 25.933013);
  ctx.bezierCurveTo(9.095299, 26.022329, 8.904701, 26.022329, 8.75, 25.933013);
  ctx.bezierCurveTo(8.595299, 25.843696, 8.5, 25.678633, 8.5, 25.5);
  ctx.bezierCurveTo(8.5, 25.321367, 8.595299, 25.156304, 8.75, 25.066987);
  ctx.bezierCurveTo(8.904701, 24.977671, 9.095299, 24.977671, 9.25, 25.066987);
  ctx.bezierCurveTo(9.404701, 25.156304, 9.5, 25.321367, 9.5, 25.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Eyes
  ctx.save();
  ctx.beginPath();
  ctx.save();
  ctx.transform(0.866, 0.5, -0.5, 0.866, 9.693, -5.173);
  ctx.moveTo(15.0, 15.5);
  ctx.bezierCurveTo(15.0, 16.035898, 14.904701, 16.531089, 14.75, 16.799038);
  ctx.bezierCurveTo(
    14.595299,
    17.066987,
    14.404701,
    17.066987,
    14.25,
    16.799038
  );
  ctx.bezierCurveTo(14.095299, 16.531089, 14.0, 16.035898, 14.0, 15.5);
  ctx.bezierCurveTo(14.0, 14.964102, 14.095299, 14.468911, 14.25, 14.200962);
  ctx.bezierCurveTo(
    14.404701,
    13.933013,
    14.595299,
    13.933013,
    14.75,
    14.200962
  );
  ctx.bezierCurveTo(14.904701, 14.468911, 15.0, 14.964102, 15.0, 15.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  if (pieceColors[player].isLight) return;

  // Dark colors only
  ctx.beginPath();
  ctx.moveTo(24.55, 10.4);
  ctx.lineTo(24.1, 11.85);
  ctx.lineTo(24.6, 12.0);
  ctx.bezierCurveTo(27.75, 13.0, 30.25, 14.49, 32.5, 18.75);
  ctx.bezierCurveTo(34.75, 23.01, 35.75, 29.06, 35.25, 39.0);
  ctx.lineTo(35.2, 39.5);
  ctx.lineTo(37.45, 39.5);
  ctx.lineTo(37.5, 39.0);
  ctx.bezierCurveTo(38.0, 28.94, 36.62, 22.15, 34.25, 17.66);
  ctx.bezierCurveTo(31.88, 13.17, 28.46, 11.02, 25.06, 10.5);
  ctx.lineTo(24.55, 10.4);
  //ctx.closePath();
  ctx.fill();
}
