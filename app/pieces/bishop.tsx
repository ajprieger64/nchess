/*
Creative Commons Attribution
Original work: "Chess_blt45.svg" by CBurnett
URL: https://commons.wikimedia.org/wiki/File:Chess_blt45.svg
Original and derivative work licensed under: CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/)
The work has been altered from its original form as an SVG into the code below.
*/

export default function drawBishop(
  ctx: CanvasRenderingContext2D,
  player: number
) {
  ctx.strokeStyle = "rgb(255, 255, 0)";
  ctx.fillStyle = "rgb(255, 0, 255)";
  ctx.lineWidth = 1.5;

  // Base
  ctx.beginPath();
  ctx.moveTo(9.0, 36.0);
  ctx.bezierCurveTo(12.39, 35.03, 19.11, 36.43, 22.5, 34.0);
  ctx.bezierCurveTo(25.89, 36.43, 32.61, 35.03, 36.0, 36.0);
  ctx.bezierCurveTo(36.0, 36.0, 37.65, 36.54, 39.0, 38.0);
  ctx.bezierCurveTo(38.32, 38.97, 37.35, 38.99, 36.0, 38.5);
  ctx.bezierCurveTo(32.61, 37.53, 25.89, 38.96, 22.5, 37.5);
  ctx.bezierCurveTo(19.11, 38.96, 12.39, 37.53, 9.0, 38.5);
  ctx.bezierCurveTo(7.65, 38.99, 6.68, 38.97, 6.0, 38.0);
  ctx.bezierCurveTo(7.35, 36.54, 9.0, 36.0, 9.0, 36.0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Body
  ctx.beginPath();
  ctx.moveTo(15.0, 32.0);
  ctx.bezierCurveTo(17.5, 34.5, 27.5, 34.5, 30.0, 32.0);
  ctx.bezierCurveTo(30.5, 30.5, 30.0, 30.0, 30.0, 30.0);
  ctx.bezierCurveTo(30.0, 27.5, 27.5, 26.0, 27.5, 26.0);
  ctx.bezierCurveTo(33.0, 24.5, 33.5, 14.5, 22.5, 10.5);
  ctx.bezierCurveTo(11.5, 14.5, 12.0, 24.5, 17.5, 26.0);
  ctx.bezierCurveTo(17.5, 26.0, 15.0, 27.5, 15.0, 30.0);
  ctx.bezierCurveTo(15.0, 30.0, 14.5, 30.5, 15.0, 32.0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Cap
  ctx.beginPath();
  ctx.moveTo(25.0, 8.0);
  ctx.bezierCurveTo(25.0, 8.893164, 24.523503, 9.718482, 23.75, 10.165064);
  ctx.bezierCurveTo(
    22.976497,
    10.611645,
    22.023503,
    10.611645,
    21.25,
    10.165064
  );
  ctx.bezierCurveTo(20.476497, 9.718482, 20.0, 8.893164, 20.0, 8.0);
  ctx.bezierCurveTo(20.0, 7.106836, 20.476497, 6.281518, 21.25, 5.834936);
  ctx.bezierCurveTo(22.023503, 5.388355, 22.976497, 5.388355, 23.75, 5.834936);
  ctx.bezierCurveTo(24.523503, 6.281518, 25.0, 7.106836, 25.0, 8.0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Ruffles?
  ctx.beginPath();
  ctx.moveTo(17.5, 26.0);
  ctx.lineTo(27.5, 26.0);
  ctx.moveTo(15.0, 30.0);
  ctx.lineTo(30.0, 30.0);
  ctx.stroke();

  // Cross
  ctx.beginPath();
  ctx.moveTo(22.5, 15.5);
  ctx.lineTo(22.5, 20.5);
  ctx.moveTo(20.0, 18.0);
  ctx.lineTo(25.0, 18.0);
  ctx.stroke();
}
