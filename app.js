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
}
current.shapeColor.setColorFromHex(document.getElementById('shape-color').value)
current.canvasColor.setColorFromHex(document.getElementById('canvas-color').value)

/**
 * Selection tool
 */
const selectionTool = new SelectionTool(canvas, gl, current)

/**
 * Line tool
 */
const lineTool = new LineTool(canvas, gl, current)

/**
 * Polygon tool
 */
const polygonTool = new PolygonTool(canvas, gl, current)

/**
 * Currently active tool
 */
let currentTool = selectionTool

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
    current.shapeColor.setColorFromHex(document.getElementById('shape-color').value)
    if (currentTool instanceof SelectionTool) {
        currentTool.setActiveShapeColor()
    }
    currentTool.drawCanvas()
}

/**
 * Sets current.canvasColor
 * and re-draws the canvas
 */
function setCanvasColor() {
    current.canvasColor.copyColor(document.getElementById('canvas-color').value)
    currentTool.drawCanvas()
}

/**
 * Changes currentTool to selectionTool
 */
function switchToSelectionTool() {
    if (!(currentTool instanceof SelectionTool)) {
        currentTool.unbindEventListeners()
        currentTool.resetTool()
        currentTool = selectionTool
        currentTool.bindEventListeners()
    }
}

/**
 * Changes currentTool to lineTool
 */
 function switchToLineTool() {
    if (!(currentTool instanceof LineTool)) {
        currentTool.unbindEventListeners()
        currentTool.resetTool()
        currentTool = lineTool
        currentTool.bindEventListeners()
    }
}

/**
 * Changes currentTool to polygonTool
 */
 function switchToPolygonTool() {
    if (!(currentTool instanceof PolygonTool)) {
        currentTool.unbindEventListeners()
        currentTool.resetTool()
        currentTool = polygonTool
        currentTool.bindEventListeners()
    }
}

/*~*~*~* MAIN PROGRAM *~*~*~*/

currentTool.drawCanvas()