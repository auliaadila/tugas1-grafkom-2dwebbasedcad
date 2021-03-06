class Point {
  /* (x, y) point container */

  /**
   * Constructor
   * @param {number=} x
   * @param {number=} y
   */
  constructor(x = 0, y = 0) {
    /** @type number */
    this.x = x;
    /** @type number */
    this.y = y;
  }

  /**
   * Copy constructor
   * @param {Point} point
   */
  copyPoint(point) {
    this.x = point.x;
    this.y = point.y;
  }

  /**
   * Setter
   * @param {number} x
   * @param {number} y
   */
  setPoint(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Transforms this point using a vector
   * @param {Vector} vector
   */
  transform(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  /**
   * Check if point is near minimum threshold area
   * @param {Point} point
   */
  isPointNear(point) {
    return (
      Math.abs(this.x - point.x) <= 0.1 && Math.abs(this.y - point.y) <= 0.1
    );
  }

  distanceTo(point) {
    let vector = new Vector(point.x - this.x, point.y - this.y);
    return vector.magnitude();
  }
}

class Vector {
  /* <x, y> vector container */

  /**
   * Constructor
   * @param {number} x
   * @param {number} y
   */
  constructor(x = 0, y = 0) {
    /** @type number */
    this.x = x;
    /** @type number */
    this.y = y;
  }

  /**
   * Calculates the vector's magnitude
   * @returns number
   */
  magnitude() {
    return (this.x ** 2 + this.y ** 2) ** 0.5;
  }

  /**
   * Adds another vector to this one
   * @param {Vector} another
   */
  add(another) {
    this.x += another.x;
    this.y += another.y;
  }

  /**
   * Addition between this vector and another vector,
   * returns a new one
   * @param {Vector} another
   * @returns Vector
   */
  plus(another) {
    return new Vector(this.x + another.x, this.y + another.y);
  }

  /**
   * Scales the vector
   * @param {number} scalar
   */
  scale(scalar) {
    this.x *= scalar;
    this.y *= scalar;
  }

  /**
   * Translates a point with this vector
   * @param {Point} point
   * @returns Point
   */
  translate(point) {
    return new Point(this.x + point.x, this.y + point.y);
  }
}

class Color {
  /* RGB color container */

  /**
   * Constructor
   * @param {number=} red
   * @param {number=} green
   * @param {number=} blue
   */
  constructor(red = 0, green = 0, blue = 0) {
    /** @type number */
    this.red = red;
    /** @type number */
    this.green = green;
    /** @type number */
    this.blue = blue;
  }

  /**
   * Copy constructor
   * @param {Color} color
   */
  copyColor(color) {
    this.red = color.red;
    this.green = color.green;
    this.blue = color.blue;
  }

  /**
   * Setter
   * @param {string} hex
   */
  setColorFromHex(hex) {
    this.red = parseInt(hex[1] + hex[2], 16);
    this.green = parseInt(hex[3] + hex[4], 16);
    this.blue = parseInt(hex[5] + hex[6], 16);
  }
}

class Shape {
  /* ABSTRACT CLASS, DON'T INSTANTIATE */
  /* Mother of all shapes */

  /**
   * Constructor
   * @param {WebGLRenderingContext} gl
   * @param {Point[]} points
   * @param {Color} color
   * @param {GLenum} GL_SHAPE
   * @param {String} name
   */
  constructor(gl, points, color, GL_SHAPE, name) {
    if (this.constructor === Shape) {
      throw new Error(
        'ERROR: Tidak bisa membuat objek dari kelas abstrak "Shape"'
      );
    }
    /** @type WebGLRenderingContext */
    this.gl = gl;
    /** @type Point[] */
    this.points = points;
    /** @type Color */
    this.color = new Color(color.red, color.green, color.blue);
    /** @type GLenum */
    this.GL_SHAPE = GL_SHAPE;
    /** @type String */
    this.name = name;
  }

  /**
   * Draws the shape
   */
  draw() {
    /* vertices = points + color */
    let vertices = [];
    for (let point of this.points) {
      vertices.push(
        point.x,
        point.y,
        this.color.red / 255,
        this.color.green / 255,
        this.color.blue / 255
      );
    }
    this.gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      gl.STATIC_DRAW
    );
    this.gl.drawArrays(this.GL_SHAPE, 0, this.points.length);
  }

  /**
   * Returns the shape's left boundary
   * @returns number
   */
  leftBoundary() {
    if (Array.isArray(this.points) && this.points.length > 0) {
      let min = this.points[0].x;
      for (let point of this.points) {
        if (point.x < min) {
          min = point.x;
        }
      }
      return min;
    } else {
      throw "Empty shape: " + this.constructor.name;
    }
  }

  /**
   * Returns the shape's right boundary
   * @returns number
   */
  rightBoundary() {
    if (Array.isArray(this.points) && this.points.length > 0) {
      let max = this.points[0].x;
      for (let point of this.points) {
        if (point.x > max) {
          max = point.x;
        }
      }
      return max;
    } else {
      throw "Empty shape: " + this.constructor.name;
    }
  }

  /**
   * Returns the shape's top boundary
   * @returns number
   */
  topBoundary() {
    if (Array.isArray(this.points) && this.points.length > 0) {
      let max = this.points[0].y;
      for (let point of this.points) {
        if (point.y > max) {
          max = point.y;
        }
      }
      return max;
    } else {
      throw "Empty shape: " + this.constructor.name;
    }
  }

  /**
   * Returns the shape's bottom boundary
   * @returns number
   */
  bottomBoundary() {
    if (Array.isArray(this.points) && this.points.length > 0) {
      let min = this.points[0].y;
      for (let point of this.points) {
        if (point.y < min) {
          min = point.y;
        }
      }
      return min;
    } else {
      throw "Empty shape: " + this.constructor.name;
    }
  }

  /**
   * Returns true if the point is within/on this shape's boundary
   * @param {Point} point
   * @returns boolean
   */
  contains(point, radius) {
    return (
      this.leftBoundary() - radius <= point.x &&
      this.rightBoundary() + radius >= point.x &&
      this.topBoundary() + radius >= point.y &&
      this.bottomBoundary() - radius <= point.y
    );
  }
}

class Line extends Shape {
  /* Child of Shape */

  /**
   * Constructor
   * @param {WebGLRenderingContext} gl
   * @param {Point[]} points
   * @param {Color} color
   */
  constructor(gl, points, color) {
    super(gl, points, color, gl.LINE_STRIP, "Line");
  }
}

class Polygon extends Shape {
  /* Child of Shape */

  /**
   * Constructor
   * @param {WebGLRenderingContext} gl
   * @param {Point[]} points
   * @param {Color} color
   */
  constructor(gl, points, color) {
    super(gl, points, color, gl.TRIANGLE_FAN, "Polygon");
  }
}

class Square extends Shape {
  /* Child of Shape */

  /**
   * Constructor
   * @param {WebGLRenderingContext} gl
   * @param {Point[]} points
   * @param {Color} color
   */
  constructor(gl, points, color) {
    super(gl, points, color, gl.TRIANGLE_FAN, "Square");
    let leastWidth = Math.min(
      Math.abs(points[0].x - points[1].x),
      Math.abs(points[0].y - points[1].y)
    );

    let scaled = (leastWidth * canvas.height) / canvas.width;

    /* First Quadrant */
    if (points[1].x > points[0].x && points[1].y > points[0].y) {
      this.newPoints = [
        new Point(points[0].x, points[0].y),
        new Point(points[0].x, points[0].y + leastWidth),
        new Point(points[0].x + scaled, points[0].y + leastWidth),
        new Point(points[0].x + scaled, points[0].y),
      ];
    } else if (points[1].x < points[0].x && points[1].y > points[0].y) {
      /* Second Quadrant */
      this.newPoints = [
        new Point(points[0].x, points[0].y),
        new Point(points[0].x, points[0].y + leastWidth),
        new Point(points[0].x - scaled, points[0].y + leastWidth),
        new Point(points[0].x - scaled, points[0].y),
      ];
    } else if (points[1].x < points[0].x && points[1].y < points[0].y) {
      /* Third Quadrant */
      this.newPoints = [
        new Point(points[0].x, points[0].y),
        new Point(points[0].x, points[0].y - leastWidth),
        new Point(points[0].x - scaled, points[0].y - leastWidth),
        new Point(points[0].x - scaled, points[0].y),
      ];
    } else {
      /* Fourth Quadrant */
      this.newPoints = [
        new Point(points[0].x, points[0].y),
        new Point(points[0].x, points[0].y - leastWidth),
        new Point(points[0].x + scaled, points[0].y - leastWidth),
        new Point(points[0].x + scaled, points[0].y),
      ];
    }
    this.points = this.newPoints;
  }
}

class Rectangle extends Shape {
  /* Child of Shape */

  /**
   * Constructor
   * @param {WebGLRenderingContext} gl
   * @param {Point[]} points
   * @param {Color} color
   */
  constructor(gl, points, color) {
    super(gl, points, color, gl.TRIANGLE_FAN, "Rectangle");
    this.newPoints = [
      new Point(points[0].x, points[0].y),
      new Point(points[0].x, points[1].y),
      new Point(points[1].x, points[1].y),
      new Point(points[1].x, points[0].y),
    ];
    this.points = this.newPoints;
  }
}

/**
 * Clear canvas button
 */
var cc = document.getElementById("clearCanvas");
cc.addEventListener("click", function () {
  location.reload();
});
class Tool {
  /* ABSTRACT CLASS, DON'T INSTANTIATE */
  /* Mother of all tools */

  /**
   * Constructor
   * @param {HTMLCanvasElement} canvas
   * @param {WebGLRenderingContext} gl
   * @param {{shapes: (Line|Polygon)[], shapeColor: Color, canvasColor: Color}} current
   */
  constructor(canvas, gl, current) {
    // if (this.constructor === Tool) {
    //   throw new Error(
    //     'ERROR: Tidak bisa membuat objek dari kelas abstrak "Tool"'
    //   );
    // }
    /** @type HTMLCanvasElement */
    this.canvas = canvas;
    /** @type WebGLRenderingContext */
    this.gl = gl;
    /** @type {{shapes: (Line|Polygon)[], shapeColor: Color, canvasColor: Color}} */
    this.current = current;
  }

  /* Draws the current state */
  _drawCanvas() {
    this.gl.clearColor(
      this.current.canvasColor.red / 255,
      this.current.canvasColor.green / 255,
      this.current.canvasColor.blue / 255,
      1
    );
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    for (let shape of this.current.shapes) {
      shape.draw();
    }
  }

  /**
   * Interface for _drawCanvas
   * Override this to add extra steps in drawing the canvas
   */
  drawCanvas() {
    this._drawCanvas();
    /* Additional drawing steps can be added after overriding this method */
  }

  /**
   * Returns a Point object that contains the current cursor position
   * (x and y values are normalized at {0, 1})
   * @param {MouseEvent} e
   * @returns {Point}
   */
  getCursorPosition(e) {
    return new Point(
      (e.offsetX / this.canvas.clientWidth) * 2 - 1,
      (1 - e.offsetY / this.canvas.clientHeight) * 2 - 1
    );
  }

  /**
   * Resets the tool
   * (to be overidden by child classes)
   */
  resetTool() {
    throw "Not implemented method: " + this.constructor.name + ".resetTool()'";
  }
}

class SelectionTool extends Tool {
  /* A tool to select shapes */

  /**
   * Constructor
   * @param {HTMLCanvasElement} canvas
   * @param {WebGLRenderingContext} gl
   * @param {{shapes: (Line|Polygon)[], shapeColor: Color, canvasColor: Color}} current
   */
  constructor(canvas, gl, current) {
    super(canvas, gl, current);
    /* Radius of a point */
    /** @type number */
    this.radius = 40 / this.canvas.width;
    /** @type Shape */
    this.activeShape = null;
    /** @type {{flag: boolean, origin: Point, points: Point[], offset(): Vector}} */
    this.dragging = {
      flag: false,
      origin: null,
      points: null,
      direction(tip) {
        return new Vector(tip.x - this.origin.x, tip.y - this.origin.y);
      },
    };
  }

  /**
   * Override drawCanvas
   */
  drawCanvas() {
    this._drawCanvas();
    this.drawSelectedShapeBoundaries();
  }

  /**
   * Reset attributes to default values
   */
  resetTool() {
    this.activeShape = null;
    this.dragging.flag = false;
    this.dragging.origin = null;
    this.dragging.points = null;
  }

  setActiveShapeColor() {
    if (this.activeShape instanceof Shape) {
      this.activeShape.color.copyColor(this.current.shapeColor);
    }
  }

  /*~*~*~* EVENT LISTENERS (and related stuffs) *~*~*~*/

  /**
   * Returns object of currently selected shape
   * @param {MouseEvent} e
   * @returns Shape
   */
  getSelectedShape(e) {
    let selectedShape = null;
    for (let i = this.current.shapes.length - 1; i > -1; i -= 1) {
      if (this.current.shapes[i].contains(this.getCursorPosition(e), this.radius)) {
        selectedShape = this.current.shapes[i];
        break;
      }
    }
    return selectedShape;
  }

  /**
   * Sets activeShape
   * Can also be programmed to do other stuff
   * @param {MouseEvent} e
   */
  selectShape(e) {
    this.activeShape = this.getSelectedShape(e);
    this.drawCanvas();
  }

  /**
   * Draws selected shape boundaries
   */
  drawSelectedShapeBoundaries() {
    if (this.activeShape instanceof Shape) {
      let leftBoundary = this.activeShape.leftBoundary();
      let rightBoundary = this.activeShape.rightBoundary();
      let topBoundary = this.activeShape.topBoundary();
      let bottomBoundary = this.activeShape.bottomBoundary();
      let topLeft = new Point(leftBoundary, topBoundary);
      let topRight = new Point(rightBoundary, topBoundary);
      let bottomLeft = new Point(leftBoundary, bottomBoundary);
      let bottomRight = new Point(rightBoundary, bottomBoundary);
      let color = new Color(0, 0, 125);
      let boundaries = [];
      boundaries.push(new Line(this.gl, [topLeft, topRight], color));
      boundaries.push(new Line(this.gl, [topRight, bottomRight], color));
      boundaries.push(new Line(this.gl, [bottomRight, bottomLeft], color));
      boundaries.push(new Line(this.gl, [bottomLeft, topLeft], color));
      for (let boundary of boundaries) {
        boundary.draw();
      }
    }
  }

  /**
   * Initializes the dragging object
   * @param {MouseEvent} e
   */
  startDragging(e) {
    if (this.activeShape instanceof Shape) {
      this.dragging.origin = this.getCursorPosition(e);
      this.dragging.points = [];
      for (let point of this.activeShape.points) {
        this.dragging.points.push(new Point(point.x, point.y));
      }
      this.dragging.flag = true;
    }
  }

  /**
   * Moves the dragged shape according to cursor movement
   * @param {MouseEvent} e
   */
  drag(e) {
    if (this.dragging.flag) {
      let vector = this.dragging.direction(this.getCursorPosition(e));
      let points = this.activeShape.points;
      let originalPoints = this.dragging.points;
      for (let i = 0; i < points.length; i += 1) {
        points[i].x = originalPoints[i].x + vector.x;
        points[i].y = originalPoints[i].y + vector.y;
      }
    }
  }

  /**
   * Terminates the dragging object
   * @param {MouseEvent} e
   */
  stopDragging(e) {
    this.dragging.flag = false;
    this.dragging.origin = null;
    this.dragging.points = null;
  }

  /**
   * Bind this to 'click' event
   * Selects the topmost shape
   * @param {MouseEvent} e */
  clickListener(e) {
    this.selectShape(e);
  }

  /**
   * Bind this to 'mousedown' event
   * Starts dragging
   * @param {MouseEvent} e
   */
  mouseDownListener(e) {
    if (!this.dragging.flag && this.activeShape instanceof Shape) {
      if (this.activeShape === this.getSelectedShape(e)) {
        this.startDragging(e);
      }
    }
  }

  /** Bind this to 'mousemove' event
   * Drags the selected shape
   * @param {MouseEvent} e
   */
  mouseMoveListener(e) {
    if (this.dragging.flag) {
      this.drag(e);
      this.drawCanvas();
    }
  }

  /**
   * Bind this to 'mouseup' event
   * Ends dragging
   * @param {MouseEvent} e
   */
  mouseUpListener(e) {
    if (this.dragging.flag) {
      this.stopDragging(e);
    }
  }
}

class TransformTool extends Tool {
  /* A tool to transform shapes/move vertices */

  /**
   * Constructor
   * @param {HTMLCanvasElement} canvas
   * @param {WebGLRenderingContext} gl
   * @param {{shapes: (Line|Polygon)[], shapeColor: Color, canvasColor: Color}} current
   */
  constructor(canvas, gl, current) {
    super(canvas, gl, current);
    /* Radius of a point */
    /** @type number */
    this.radius = 40 / this.canvas.width;
    /** @type {{shape: Shape, point: Point, pointIndex: number}} */
    this.active = {
      shape: null,
      point: null,
      pointIndex: -1,
    };
    /** @type {{flag: boolean, origin: Point, points: Point[], point: Point, offset(): Vector}} */
    this.dragging = {
      flag: false,
      origin: null,
      points: null,
      point: null,
      direction(tip) {
        return new Vector(tip.x - this.origin.x, tip.y - this.origin.y);
      },
    };
  }

  /**
   * Override drawCanvas
   */
  drawCanvas() {
    this._drawCanvas();
    this.drawSelectedShapeBorders();
  }

  /**
   * Reset attributes to default values
   */
  resetTool() {
    this.active.shape = null;
    this.active.point = null;
    this.active.pointIndex = -1;
    this.dragging.flag = false;
    this.dragging.origin = null;
    this.dragging.points = null;
    this.dragging.point = null;
  }

  /*~*~*~* EVENT LISTENERS (and related stuffs) *~*~*~*/

  /**
   * Returns object of currently selected shape
   * @param {MouseEvent} e
   * @returns Shape
   */
  getSelectedShape(e) {
    let selectedShape = null;
    for (let i = this.current.shapes.length - 1; i > -1; i -= 1) {
      if (this.current.shapes[i].contains(this.getCursorPosition(e), this.radius)) {
        selectedShape = this.current.shapes[i];
        break;
      }
    }
    return selectedShape;
  }

  /**
   * Sets active.shape
   * Can also be programmed to do other stuff
   * @param {MouseEvent} e
   */
  selectShape(e) {
    this.active.shape = this.getSelectedShape(e);
    this.drawCanvas();
  }

  drawSelectedShapeBorders() {
    if (this.active.shape instanceof Shape) {
      let color = new Color(125, 0, 125);
      let borders = [];
      for (let i = 0; i < this.active.shape.points.length; i += 1) {
        borders.push(
          new Line(
            this.gl,
            [
              this.active.shape.points[i],
              this.active.shape.points[
                (i + 1) % this.active.shape.points.length
              ],
            ],
            color
          )
        );
      }
      for (let border of borders) {
        border.draw();
      }
    }
  }

  /**
   * Returns object of currently selected point
   * @param {MouseEvent} e
   * @returns Point
   */
  getSelectedPointAndIndex(e) {
    let selected = {
      point: null,
      index: -1,
    };
    if (this.active.shape instanceof Shape) {
      for (let i = this.active.shape.points.length - 1; i > -1; i -= 1) {
        if (
          this.active.shape.points[i].distanceTo(this.getCursorPosition(e)) <
          this.radius
        ) {
          selected.point = this.active.shape.points[i];
          selected.index = i;
          break;
        }
      }
    }
    return selected;
  }

  /**
   * Sets active.point and active.pointIndex
   * Can also be programmed to do other stuff
   * @param {MouseEvent} e
   */
  selectPoint(e) {
    let selected = this.getSelectedPointAndIndex(e);
    this.active.point = selected.point;
    this.active.pointIndex = selected.index;
  }

  /**
   * Initializes the dragging object
   * @param {MouseEvent} e
   */
  startDragging(e) {
    if (
      this.active.shape instanceof Shape &&
      this.active.point instanceof Point
    ) {
      this.dragging.origin = this.getCursorPosition(e);
      this.dragging.points = [];
      for (let point of this.active.shape.points) {
        this.dragging.points.push(new Point(point.x, point.y));
      }
      this.dragging.point = this.dragging.points[this.active.pointIndex];
      this.dragging.flag = true;
    }
  }

  /**
   * Moves the dragged point according to cursor movement
   * @param {MouseEvent} e
   */
  drag(e) {
    if (this.dragging.flag) {
      /* Draw a transformation vector in the direction of cursor movement */
      let vector = this.dragging.direction(this.getCursorPosition(e));

      /** Transformation vector needs to be adjusted if:
       * - shape is a square, or
       * - shift is pressed and shape is either line or rectangle
       * We use vector projection to do this
       */
      if (
        this.active.shape instanceof Square ||
        (e.shiftKey &&
          (this.active.shape instanceof Line ||
            this.active.shape instanceof Rectangle))
      ) {
        let oppositePointIndex = -1;
        if (this.active.shape instanceof Line) {
          oppositePointIndex = (this.active.pointIndex + 1) % 2;
        } else {
          oppositePointIndex = (this.active.pointIndex + 2) % 4;
        }
        let directionVector = new Vector(
          this.dragging.point.x - this.dragging.points[oppositePointIndex].x,
          this.dragging.point.y - this.dragging.points[oppositePointIndex].y
        );
        let magnitude =
          (vector.x * directionVector.x + vector.y * directionVector.y) /
          (directionVector.x ** 2 + directionVector.y ** 2);
        vector.x = magnitude * directionVector.x;
        vector.y = magnitude * directionVector.y;

        /* Final check when shape is a Square */
        if (this.active.shape instanceof Square) {
          vector.x =
            Math.sign(vector.x) *
            Math.min(Math.abs(vector.x), Math.abs(vector.y));
          vector.y = Math.sign(vector.y) * Math.abs(vector.x);
        }
      }

      /* Scale transformation vector, accounting for not 1:1 canvas */
      vector.x *= Math.min(this.canvas.height, this.canvas.width) / this.canvas.width
      vector.y *= Math.min(this.canvas.height, this.canvas.width) / this.canvas.height

      /* Translate the point */
      this.active.point.x = this.dragging.point.x + vector.x;
      this.active.point.y = this.dragging.point.y + vector.y;

      /* If shape is a square or a rectangle, also translate the adjacent points */
      if (
        this.active.shape instanceof Square ||
        this.active.shape instanceof Rectangle
      ) {
        let adjacentPoints = [];
        adjacentPoints.push({
          active: this.active.shape.points[(this.active.pointIndex + 1) % 4],
          dragging: this.dragging.points[(this.active.pointIndex + 1) % 4],
        });
        adjacentPoints.push({
          active: this.active.shape.points[(this.active.pointIndex + 3) % 4],
          dragging: this.dragging.points[(this.active.pointIndex + 3) % 4],
        });
        for (let adjacentPoint of adjacentPoints) {
          if (
            Math.abs(adjacentPoint.dragging.x - this.dragging.point.x) >
            Math.abs(adjacentPoint.dragging.y - this.dragging.point.y)
          ) {
            adjacentPoint.active.y = this.active.point.y;
          } else {
            adjacentPoint.active.x = this.active.point.x;
          }
        }
      }
    }
  }

  /**
   * Terminates the dragging object
   * @param {MouseEvent} e
   */
  stopDragging(e) {
    this.dragging.flag = false;
    this.dragging.origin = null;
    this.dragging.points = null;
    this.dragging.point = null;
  }

  /**
   * De-sets active.point and active.pointIndex
   * Can also be programmed to do other stuff
   */
  deSelectPoint() {
    this.active.point = null;
    this.active.pointIndex = -1;
  }

  /**
   * Bind this to 'click' event
   * Selects the topmost shape
   * @param {MouseEvent} e */
  clickListener(e) {
    this.selectShape(e);
  }

  /**
   * Bind this to 'mousedown' event
   * Starts dragging
   * @param {MouseEvent} e
   */
  mouseDownListener(e) {
    if (!this.dragging.flag && this.active.shape instanceof Shape) {
      this.selectPoint(e);
      if (this.active.point instanceof Point) {
        this.startDragging(e);
      }
    }
  }

  /** Bind this to 'mousemove' event
   * Drags the selected point
   * @param {MouseEvent} e
   */
  mouseMoveListener(e) {
    if (this.dragging.flag) {
      this.drag(e);
      this.drawCanvas();
    }
  }

  /**
   * Bind this to 'mouseup' event
   * Ends dragging
   * @param {MouseEvent} e
   */
  mouseUpListener(e) {
    if (this.dragging.flag) {
      this.stopDragging(e);
      this.deSelectPoint();
    }
  }
}

class LineTool extends Tool {
  /* A tool to create lines */

  /**
   * Constructor
   * @param {HTMLCanvasElement} canvas
   * @param {WebGLRenderingContext} gl
   * @param {{shapes: (Line|Polygon)[], shapeColor: Color, canvasColor: Color}} current
   */
  constructor(canvas, gl, current) {
    super(canvas, gl, current);
    /** @type Line */
    this.line = null;
    /** @type boolean */
    this.isDrawing = false;
  }

  /**
   * Reset .line and .isDrawing to default values
   */
  resetTool() {
    this.line = null;
    this.isDrawing = false;
  }

  /**
   * Bind this to 'click' event
   * @param {MouseEvent} e
   */
  clickListener(e) {
    if (this.isDrawing) {
      this.current.shapes.push(this.line);
      this.drawCanvas();
      this.resetTool();
    } else {
      let point = this.getCursorPosition(e);
      this.line = new Line(
        this.gl,
        [point, new Point()],
        this.current.shapeColor
      );
      this.isDrawing = true;
    }
  }

  /**
   * Bind this to 'mousemove' event
   * @param {MouseEvent} e
   */
  mouseMoveListener(e) {
    if (this.isDrawing) {
      this.drawCanvas();
      this.line.points[1].copyPoint(this.getCursorPosition(e));
      this.line.draw();
    }
  }
}

class PolygonTool extends Tool {
  /* A tool to create polygons */

  /**
   * Constructor
   * @param {HTMLCanvasElement} canvas
   * @param {WebGLRenderingContext} gl
   * @param {{shapes: (Line|Polygon)[], shapeColor: Color, canvasColor: Color}} current
   */
  constructor(canvas, gl, current) {
    super(canvas, gl, current);
    /** @type Line */
    this.polygon = null;
    /** @type boolean */
    this.isDrawing = false;
  }

  /**
   * Reset .polygon and .isDrawing to default values
   */
  resetTool() {
    this.polygon = null;
    this.isDrawing = false;
  }

  /**
   * Bind this to 'click' event
   * @param {MouseEvent} e
   */
  clickListener(e) {
    if (this.isDrawing) {
      this.drawCanvas();
      this.polygon.points.push(this.getCursorPosition(e));
      this.polygon.draw();
    } else {
      let point = this.getCursorPosition(e);
      this.polygon = new Polygon(
        this.gl,
        [point, new Point()],
        this.current.shapeColor
      );
      this.isDrawing = true;
    }
  }

  /**
   * Bind this to 'mousemove' event
   * @param {MouseEvent} e
   */
  mouseMoveListener(e) {
    if (this.isDrawing) {
      this.drawCanvas();
      this.polygon.points[this.polygon.points.length - 1].copyPoint(
        this.getCursorPosition(e)
      );
      this.polygon.draw();
    }
  }

  /**
   * Bind this to 'contextmenu' event
   * @param {MouseEvent} e
   */
  rightClickListener(e) {
    if (this.isDrawing) {
      e.preventDefault();
      this.current.shapes.push(this.polygon);
      this.drawCanvas();
      this.resetTool();
    }
  }
}

class RectangleTool extends Tool {
  /* A tool to create rectangles */

  /**
   * Constructor
   * @param {HTMLCanvasElement} canvas
   * @param {WebGLRenderingContext} gl
   * @param {{shapes: (Rectangle)[], shapeColor: Color, canvasColor: Color}} current
   */
  constructor(canvas, gl, current) {
    super(canvas, gl, current);
    /** @type Rectangle */
    this.rectangle = null;
    /** @type boolean */
    this.isDrawing = false;
  }

  /**
   * Reset .line and .isDrawing to default values
   */
  resetTool() {
    this.rectangle = null;
    this.isDrawing = false;
  }

  /**
   * Bind this to 'click' event
   * @param {MouseEvent} e
   */
  clickListener(e) {
    if (this.isDrawing) {
      this.current.shapes.push(this.rectangle);
      this.drawCanvas();
      this.resetTool();
    } else {
      let point = this.getCursorPosition(e);
      this.rectangle = new Rectangle(
        this.gl,
        [point, new Point()],
        this.current.shapeColor
      );
      this.isDrawing = true;
    }
  }

  /**
   * Bind this to 'mousemove' event
   * @param {MouseEvent} e
   */
  mouseMoveListener(e) {
    if (this.isDrawing) {
      this.drawCanvas();
      this.rectangle = new Rectangle(
        this.gl,
        [this.rectangle.points[0], this.getCursorPosition(e)],
        this.current.shapeColor
      );
      this.rectangle.draw();
    }
  }
}

class SquareTool extends Tool {
  /* A tool to create squares */

  /**
   * Constructor
   * @param {HTMLCanvasElement} canvas
   * @param {WebGLRenderingContext} gl
   * @param {{shapes: (Square)[], shapeColor: Color, canvasColor: Color}} current
   */
  constructor(canvas, gl, current) {
    super(canvas, gl, current);
    /** @type Square */
    this.square = null;
    /** @type boolean */
    this.isDrawing = false;
  }

  /**
   * Reset .line and .isDrawing to default values
   */
  resetTool() {
    this.square = null;
    this.isDrawing = false;
  }

  /**
   * Bind this to 'click' event
   * @param {MouseEvent} e
   */
  clickListener(e) {
    if (this.isDrawing) {
      this.current.shapes.push(this.square);
      this.drawCanvas();
      this.resetTool();
    } else {
      let point = this.getCursorPosition(e);
      this.square = new Square(
        this.gl,
        [point, new Point()],
        this.current.shapeColor
      );
      this.isDrawing = true;
    }
  }

  /**
   * Bind this to 'mousemove' event
   * @param {MouseEvent} e
   */
  mouseMoveListener(e) {
    if (this.isDrawing) {
      this.drawCanvas();
      this.square = new Square(
        this.gl,
        [this.square.points[0], this.getCursorPosition(e)],
        this.current.shapeColor
      );
      this.square.draw();
    }
  }
}

class ResizeTool extends Tool {
  /* A tool to create squares */

  /**
   * Constructor
   * @param {HTMLCanvasElement} canvas
   * @param {WebGLRenderingContext} gl
   * @param {{shapes: (Square)[], shapeColor: Color, canvasColor: Color}} current
   */
  constructor(canvas, gl, current) {
    super(canvas, gl, current);
    /** @type int */
    this.selected = [];
    /** @type boolean */
    this.isDragging = false;
    /** @type Shape */
    this.shape = null;
    /**@type Color */
    this.color = null;
  }

  /**
   * Override drawCanvas
   */
  drawCanvas() {
    this._drawCanvas();
    this.drawSelectedShapeBorders();
  }

  /**
   * Reset .line and .isDrawing to default values
   */
  resetTool() {
    this.shape = null;
    this.selected = [];
    this.isDragging = false;
    this.color = null;
  }

  /**
   * Returns of index and point inside clicked area threshold
   * @param {Point} point
   */

  getIndex(point) {
    for (let i = 0; i < this.current.shapes.length; i++) {
      if (
        this.current.shapes[i] instanceof Square ||
        this.current.shapes[i] instanceof Rectangle
      ) {
        let point1 = this.current.shapes[i].newPoints[0];
        let point2 = this.current.shapes[i].newPoints[1];
        let point3 = this.current.shapes[i].newPoints[2];
        let point4 = this.current.shapes[i].newPoints[3];

        if (point.isPointNear(point1)) {
          this.selected.push(i);
          this.selected.push(point3);
        } else if (point.isPointNear(point2)) {
          this.selected.push(i);
          this.selected.push(point4);
        } else if (point.isPointNear(point3)) {
          this.selected.push(i);
          this.selected.push(point1);
        } else if (point.isPointNear(point4)) {
          this.selected.push(i);
          this.selected.push(point2);
        }
      } else if (this.current.shapes[i] instanceof Line) {
        if (point.isPointNear(this.current.shapes[i].points[0])) {
          this.selected.push(i, this.current.shapes[i].points[1]);
        } else if (point.isPointNear(this.current.shapes[i].points[1])) {
          this.selected.push(i, this.current.shapes[i].points[0]);
        }
      }
    }
  }

  drawSelectedShapeBorders() {
    if (this.shape instanceof Shape) {
      let color = new Color(125, 0, 125);
      let borders = [];
      for (let i = 0; i < this.shape.points.length; i += 1) {
        borders.push(
          new Line(
            this.gl,
            [
              this.shape.points[i],
              this.shape.points[(i + 1) % this.shape.points.length],
            ],
            color
          )
        );
      }
      for (let border of borders) {
        border.draw();
      }
    }
  }

  /**
   * Bind this to 'click' event
   * @param {MouseEvent} e
   */
  clickListener(e) {
    if (this.isDragging) {
      this.current.shapes.push(this.shape);
      this.shape.draw();
      this.drawCanvas();
      this.resetTool();
    } else {
      let point = this.getCursorPosition(e);
      this.getIndex(point);

      if (this.selected.length > 0) {
        this.color = this.current.shapes[this.selected[0]].color;
        if (this.current.shapes[this.selected[0]] instanceof Square) {
          this.shape = new Square(
            this.gl,
            [this.selected[1], point],
            this.color
          );

          this.current.shapes.splice(this.selected[0], 1);
          this.isDragging = true;
        } else if (this.current.shapes[this.selected[0]] instanceof Line) {
          this.shape = new Line(this.gl, [this.selected[1], point], this.color);

          this.current.shapes.splice(this.selected[0], 1);
          this.isDragging = true;
        } else if (this.current.shapes[this.selected[0]] instanceof Rectangle) {
          this.shape = new Rectangle(
            this.gl,
            [this.selected[1], point],
            this.color
          );

          this.current.shapes.splice(this.selected[0], 1);
          this.isDragging = true;
        } else {
          this.resetTool();
        }
      }
    }
  }

  /**
   * Bind this to 'mousemove' event
   * @param {MouseEvent} e
   */
  mouseMoveListener(e) {
    if (this.isDragging) {
      if (this.shape instanceof Square) {
        this.shape = new Square(
          this.gl,
          [this.shape.points[0], this.getCursorPosition(e)],
          this.color
        );
      } else if (this.shape instanceof Line) {
        this.shape.points[1].copyPoint(this.getCursorPosition(e));
      } else if (this.shape instanceof Rectangle) {
        this.shape = new Rectangle(
          this.gl,
          [this.shape.points[0], this.getCursorPosition(e)],
          this.color
        );
      }

      this.drawCanvas();
      this.shape.draw();
    }
  }
}
