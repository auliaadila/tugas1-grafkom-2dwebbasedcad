/// <reference path='engine.js' />
/// <reference path='classes.js' />
/// <reference path='app.js' />

function download(content, filename = "file.json", contentType = "json") {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function save() {
  const data = { current };
  download(JSON.stringify(data));
}

let saveButton = document.getElementById("save");
saveButton.addEventListener("click", save);

let loadButton = document.getElementById("load");
loadButton.addEventListener("change", function (e) {
  const file = e.target.files[0];
  var reader = new FileReader();
  reader.readAsText(file);

  reader.onload = function (e) {
    var content = e.target.result;
    var parsedData = JSON.parse(content);

    current.shapes = [];

    for (let shape of parsedData.current.shapes) {
      shape.gl = currentTool.gl;
      let points = [];
      for (let point of shape.points) {
        points.push(new Point(point.x, point.y));
      }
      shape.points = points;
      let color = new Color(
        shape.color.red,
        shape.color.green,
        shape.color.blue
      );
      shape.color = color;

      if (shape.name == "Line") {
        current.shapes.push(new Line(shape.gl, shape.points, shape.color));
      } else if (shape.name == "Polygon") {
        current.shapes.push(new Polygon(shape.gl, shape.points, shape.color));
      } else if (shape.name == "Rectangle") {
        current.shapes.push(
          new Rectangle(
            shape.gl,
            [shape.points[0], shape.points[2]],
            shape.color
          )
        );
      } else if (shape.name == "Square") {
        current.shapes.push(
          new Square(shape.gl, [shape.points[0], shape.points[2]], shape.color)
        );
      }
    }
    current.shapeColor = new Color(
      parsedData.current.shapeColor.red,
      parsedData.current.shapeColor.green,
      parsedData.current.shapeColor.blue
    );

    current.canvasColor = new Color(
      parsedData.current.canvasColor.red,
      parsedData.current.canvasColor.green,
      parsedData.current.canvasColor.blue
    );
    currentTool.drawCanvas();
  };
});
