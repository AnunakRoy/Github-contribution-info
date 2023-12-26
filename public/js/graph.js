//code for making the contribution graph on canvas and converting it to an image
console.log("Displaying Contribution Graph...");
const graphImgElement = document.getElementById('graph-img');

// creating a canvas to form the contribution graph
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// setting canvas dimensions
canvas.width = contributionGraph.weeks.length * 12;
canvas.height = 100;

// drawing contribution squares on the canvas
contributionGraph.weeks.forEach((week, weekIndex) => {
  week.contributionDays.forEach((day, dayIndex) => {
    ctx.fillStyle = day.color;
    ctx.fillRect(weekIndex * 12, dayIndex * 12, 10, 10);
  });
});

// converting the canvas to an image and appending it to the original index.ejs  div
const imgData = canvas.toDataURL('image/png');
const imgElement = document.createElement('img');
imgElement.src = imgData;
graphImgElement.appendChild(imgElement);
