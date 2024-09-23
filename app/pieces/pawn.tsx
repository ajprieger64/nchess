/*
Creative Commons Attribution
Original work: "Chess_plt45.svg" by CBurnett
URL: https://commons.wikimedia.org/wiki/File:Chess_plt45.svg
Original and derivative work licensed under: CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/)
The work has been altered from its original form as an SVG into the code below.
*/

export default function drawPawn(
  ctx: CanvasRenderingContext2D,
  player: number
) {
  ctx.strokeStyle = "rgb(255, 255, 0)";
  ctx.fillStyle = "rgb(255, 0, 255)";
  ctx.lineWidth = 1.5;

  // Body
  ctx.beginPath();
  ctx.moveTo(22.5, 9.0);
  ctx.bezierCurveTo(20.29, 9.0, 18.5, 10.79, 18.5, 13.0);
  ctx.bezierCurveTo(18.5, 13.89, 18.79, 14.71, 19.28, 15.38);
  ctx.bezierCurveTo(17.33, 16.5, 16.0, 18.59, 16.0, 21.0);
  ctx.bezierCurveTo(16.0, 23.03, 16.94, 24.84, 18.41, 26.03);
  ctx.bezierCurveTo(15.41, 27.09, 11.0, 31.58, 11.0, 39.5);
  ctx.lineTo(34.0, 39.5);
  ctx.bezierCurveTo(34.0, 31.58, 29.59, 27.09, 26.59, 26.03);
  ctx.bezierCurveTo(28.06, 24.84, 29.0, 23.03, 29.0, 21.0);
  ctx.bezierCurveTo(29.0, 18.59, 27.67, 16.5, 25.72, 15.38);
  ctx.bezierCurveTo(26.21, 14.71, 26.5, 13.89, 26.5, 13.0);
  ctx.bezierCurveTo(26.5, 10.79, 24.71, 9.0, 22.5, 9.0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
