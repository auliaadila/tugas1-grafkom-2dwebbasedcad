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
 * Event listener tracker
 * Event listeners are delicate things, they get special treatment
 */
const eventListeners = {
    list: [],
    append(a) {
        this.list.push(a)
    },
    clear() {
        while (this.list.length > 0) {
            this.list.pop()
        }
    },
    addToCanvas() {
        for (let a of this.list) {
            canvas.addEventListener(a[0], a[1])
        }
    },
    removeFromCanvas() {
        for (let a of this.list) {
            canvas.removeEventListener(a[0], a[1])
        }
    }
}

/**
 * Set up selection tool as active tool
 */
eventListeners.append(['click', selectionTool.clickListener.bind(selectionTool)])
eventListeners.append(['mousedown', selectionTool.mouseDownListener.bind(selectionTool)])
eventListeners.append(['mouseup', selectionTool.mouseUpListener.bind(selectionTool)])
eventListeners.addToCanvas()
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
        currentTool.resetTool()
        eventListeners.removeFromCanvas()
        eventListeners.clear()
        eventListeners.append(['click', selectionTool.clickListener.bind(selectionTool)])
        eventListeners.append(['mousedown', selectionTool.mouseDownListener.bind(selectionTool)])
        eventListeners.append(['mouseup', selectionTool.mouseUpListener.bind(selectionTool)])
        eventListeners.addToCanvas()
        currentTool = selectionTool
    }
}

/**
 * Changes currentTool to lineTool
 */
function switchToLineTool() {
    if (!(currentTool instanceof LineTool)) {
        currentTool.resetTool()
        eventListeners.removeFromCanvas()
        eventListeners.clear()
        eventListeners.append(['click', lineTool.clickListener.bind(lineTool)])
        eventListeners.append(['mousemove', lineTool.mouseMoveListener.bind(lineTool)])
        eventListeners.addToCanvas()
        currentTool = lineTool
    }
}

/**
 * Changes currentTool to polygonTool
 */
function switchToPolygonTool() {
    if (!(currentTool instanceof PolygonTool)) {
        eventListeners.removeFromCanvas()
        eventListeners.clear()
        eventListeners.append(['click', polygonTool.clickListener.bind(polygonTool)])
        eventListeners.append(['mousemove', polygonTool.mouseMoveListener.bind(polygonTool)])
        eventListeners.append(['contextmenu', polygonTool.rightClickListener.bind(polygonTool)])
        eventListeners.addToCanvas()
        currentTool = polygonTool
    }
}

/*~*~*~* MAIN PROGRAM *~*~*~*/

currentTool.drawCanvas()