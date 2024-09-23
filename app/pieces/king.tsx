/*
Creative Commons Attribution
Original work: "Chess_klt45.svg" by CBurnett
URL: https://commons.wikimedia.org/wiki/File:Chess_klt45.svg
Original and derivative work licensed under: CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/)
The work has been altered from its original form as an SVG into the code below.
*/

export default function drawKing(
  ctx: CanvasRenderingContext2D,
  player: number
) {
  ctx.strokeStyle = "rgb(255, 255, 0)";
  ctx.fillStyle = "rgb(255, 0, 255)";
  ctx.lineWidth = 1.5;

  // Cross
  ctx.beginPath();
  ctx.moveTo(22.5, 11.63);
  ctx.lineTo(22.5, 6.0);
  ctx.moveTo(20.0, 8.0);
  ctx.lineTo(25.0, 8.0);
  ctx.stroke();

  // Crown / headpiece
  ctx.beginPath();
  ctx.moveTo(22.5, 25.0);
  ctx.bezierCurveTo(22.5, 25.0, 27.0, 17.5, 25.5, 14.5);
  ctx.bezierCurveTo(25.5, 14.5, 24.5, 12.0, 22.5, 12.0);
  ctx.bezierCurveTo(20.5, 12.0, 19.5, 14.5, 19.5, 14.5);
  ctx.bezierCurveTo(18.0, 17.5, 22.5, 25.0, 22.5, 25.0);
  ctx.fill();
  ctx.stroke();

  // Body
  ctx.beginPath();
  ctx.moveTo(12.5, 37.0);
  ctx.bezierCurveTo(18.0, 40.5, 27.0, 40.5, 32.5, 37.0);
  ctx.lineTo(32.5, 30.0);
  ctx.bezierCurveTo(32.5, 30.0, 41.5, 25.5, 38.5, 19.5);
  ctx.bezierCurveTo(34.5, 13.0, 25.0, 16.0, 22.5, 23.5);
  ctx.lineTo(22.5, 27.0);
  ctx.lineTo(22.5, 23.5);
  ctx.bezierCurveTo(20.0, 16.0, 10.5, 13.0, 6.5, 19.5);
  ctx.bezierCurveTo(3.5, 25.5, 12.5, 30.0, 12.5, 30.0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Ruffles? Not sure what these are supposed to represent
  ctx.beginPath();
  ctx.moveTo(12.5, 30.0);
  ctx.bezierCurveTo(18.0, 27.0, 27.0, 27.0, 32.5, 30.0);
  ctx.moveTo(12.5, 33.5);
  ctx.bezierCurveTo(18.0, 30.5, 27.0, 30.5, 32.5, 33.5);
  ctx.moveTo(12.5, 37.0);
  ctx.bezierCurveTo(18.0, 34.0, 27.0, 34.0, 32.5, 37.0);
  ctx.stroke();
}
