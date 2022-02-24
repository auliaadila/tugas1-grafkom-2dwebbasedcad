/// <reference path='engine.js' />
/// <reference path='classes.js' />

/**
 * Initialization
 * Initialize all tools
 * and a blank canvas as the current state
 */

/**
 * The current state
 * .shapes = list of all Shape objects
 * shapeColor = js representation of shape-color in html
 * canvasColor = js representation of canvas-color in html
 */
const current = {
  /** @type {(Line|Polygon)[]} */
  shapes: [],
  /** @type Color */
  shapeColor: new Color(),
  /** @type Color */
  canvasColor: new Color(),
};
current.shapeColor.setColorFromHex(
  document.getElementById("shape-color").value
);
current.canvasColor.setColorFromHex(
  document.getElementById("canvas-color").value
);

/**
 * Selection tool
 */
const selectionTool = new SelectionTool(canvas, gl, current);

/**
 * Transform tool
 */
const transformTool = new TransformTool(canvas, gl, current);

/**
 * Resize tool
 */
 const resizeTool = new ResizeTool(canvas, gl, current);

/**
 * Line tool
 */
const lineTool = new LineTool(canvas, gl, current);

/**
 * Polygon tool
 */
const polygonTool = new PolygonTool(canvas, gl, current);

/**
 * Rectangle tool
 */
const rectangleTool = new RectangleTool(canvas, gl, current);

/**
 * Square tool
 */
const squareTool = new SquareTool(canvas, gl, current);

/**
 * Event listener tracker
 * Event listeners are delicate things, they get special treatment
 */
const eventListeners = {
  list: [],
  append(a) {
    this.list.push(a);
  },
  clear() {
    while (this.list.length > 0) {
      this.list.pop();
    }
  },
  addToCanvas() {
    for (let a of this.list) {
      canvas.addEventListener(a[0], a[1]);
    }
  },
  removeFromCanvas() {
    for (let a of this.list) {
      canvas.removeEventListener(a[0], a[1]);
    }
  },
};

/**
 * Set up selection tool as active tool
 */
eventListeners.append([
  "click",
  selectionTool.clickListener.bind(selectionTool),
]);
eventListeners.append([
  "mousedown",
  selectionTool.mouseDownListener.bind(selectionTool),
]);
eventListeners.append([
  "mousemove",
  selectionTool.mouseMoveListener.bind(selectionTool),
]);
eventListeners.append([
  "mouseup",
  selectionTool.mouseUpListener.bind(selectionTool),
]);
eventListeners.addToCanvas();
let currentTool = selectionTool;

/**
 * Control functions
 * Call these from the html file
 */

/**
 * Sets current.shapeColor,
 * tells selectionTool about the change,
 * and re-draws the canvas
 */
function setShapeColor() {
  current.shapeColor.setColorFromHex(
    document.getElementById("shape-color").value
  );
  if (currentTool instanceof SelectionTool) {
    currentTool.setActiveShapeColor();
  }
  currentTool.drawCanvas();
}

/**
 * Sets current.canvasColor
 * and re-draws the canvas
 */
function setCanvasColor() {
  current.canvasColor.copyColor(document.getElementById("canvas-color").value);
  currentTool.drawCanvas();
}

/**
 * Changes currentTool to selectionTool
 */
function switchToSelectionTool() {
  if (!(currentTool instanceof SelectionTool)) {
    currentTool.resetTool();
    eventListeners.removeFromCanvas();
    eventListeners.clear();
    eventListeners.append([
      "click",
      selectionTool.clickListener.bind(selectionTool),
    ]);
    eventListeners.append([
      "mousedown",
      selectionTool.mouseDownListener.bind(selectionTool),
    ]);
    eventListeners.append([
      "mousemove",
      selectionTool.mouseMoveListener.bind(selectionTool),
    ]);
    eventListeners.append([
      "mouseup",
      selectionTool.mouseUpListener.bind(selectionTool),
    ]);
    eventListeners.addToCanvas();
    currentTool = selectionTool;
    currentTool.drawCanvas();
  }
}

/**
 * Changes currentTool to transformTool
 */
function switchToTransformTool() {
  if (!(currentTool instanceof TransformTool)) {
    currentTool.resetTool();
    eventListeners.removeFromCanvas();
    eventListeners.clear();
    eventListeners.append([
      "click",
      transformTool.clickListener.bind(transformTool),
    ]);
    eventListeners.append([
      "mousedown",
      transformTool.mouseDownListener.bind(transformTool),
    ]);
    eventListeners.append([
      "mousemove",
      transformTool.mouseMoveListener.bind(transformTool),
    ]);
    eventListeners.append([
      "mouseup",
      transformTool.mouseUpListener.bind(transformTool),
    ]);
    eventListeners.addToCanvas();
    currentTool = transformTool;
    currentTool.drawCanvas();
  }
}

/**
 * Changes currentTool to lineTool
 */
function switchToLineTool() {
  if (!(currentTool instanceof LineTool)) {
    currentTool.resetTool();
    eventListeners.removeFromCanvas();
    eventListeners.clear();
    eventListeners.append(["click", lineTool.clickListener.bind(lineTool)]);
    eventListeners.append([
      "mousemove",
      lineTool.mouseMoveListener.bind(lineTool),
    ]);
    eventListeners.addToCanvas();
    currentTool = lineTool;
    currentTool.drawCanvas();
  }
}

/**
 * Changes currentTool to polygonTool
 */
function switchToPolygonTool() {
  if (!(currentTool instanceof PolygonTool)) {
    currentTool.resetTool();
    eventListeners.removeFromCanvas();
    eventListeners.clear();
    eventListeners.append([
      "click",
      polygonTool.clickListener.bind(polygonTool),
    ]);
    eventListeners.append([
      "mousemove",
      polygonTool.mouseMoveListener.bind(polygonTool),
    ]);
    eventListeners.append([
      "contextmenu",
      polygonTool.rightClickListener.bind(polygonTool),
    ]);
    eventListeners.addToCanvas();
    currentTool = polygonTool;
    currentTool.drawCanvas();
  }
}

/**
 * Changes currentTool to polygonTool
 */
function switchToRectangleTool() {
  if (!(currentTool instanceof RectangleTool)) {
    currentTool.resetTool();
    eventListeners.removeFromCanvas();
    eventListeners.clear();
    eventListeners.append([
      "click",
      rectangleTool.clickListener.bind(rectangleTool),
    ]);
    eventListeners.append([
      "mousemove",
      rectangleTool.mouseMoveListener.bind(rectangleTool),
    ]);
    eventListeners.addToCanvas();
    currentTool = rectangleTool;
    currentTool.drawCanvas();
  }
}

function switchToSquareTool() {
  if (!(currentTool instanceof SquareTool)) {
    currentTool.resetTool();
    eventListeners.removeFromCanvas();
    eventListeners.clear();
    eventListeners.append(["click", squareTool.clickListener.bind(squareTool)]);
    eventListeners.append([
      "mousemove",
      squareTool.mouseMoveListener.bind(squareTool),
    ]);
    eventListeners.addToCanvas();
    currentTool = squareTool;
    currentTool.drawCanvas();
  }
}

function switchToResizeTool() {
  if (!(currentTool instanceof ResizeTool)) {
    console.log("Resize Mode")
    eventListeners.removeFromCanvas();
    eventListeners.clear();
    eventListeners.append(["click", resizeTool.clickListener.bind(resizeTool)]);
    eventListeners.append([
      "mousemove",
      resizeTool.mouseMoveListener.bind(resizeTool),
    ]);
    eventListeners.addToCanvas();
    currentTool = resizeTool;
  }
}

/*~*~*~* MAIN PROGRAM *~*~*~*/

currentTool.drawCanvas();
