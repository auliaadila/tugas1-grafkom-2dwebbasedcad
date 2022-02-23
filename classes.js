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
    this.green = parseInt(hex[3] + hex[6], 16);
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
   */
  constructor(gl, points, color, GL_SHAPE) {
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
    this.color = color;
    /** @type GLenum */
    this.GL_SHAPE = GL_SHAPE;
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
        this.color.red,
        this.color.green,
        this.color.blue
      );
    }
    this.gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      gl.STATIC_DRAW
    );

    this.gl.drawArrays(this.GL_SHAPE, 0, this.points.length);
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
    super(gl, points, color, gl.LINE_STRIP);
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
    super(gl, points, color, gl.TRIANGLE_FAN);
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
    super(gl, points, color, gl.TRIANGLE_FAN);
    let leastWidth =
      Math.abs(points[0].x - points[1].x) < Math.abs(points[0].y - points[1].y)
        ? Math.abs(points[0].x - points[1].x)
        : Math.abs(points[0].y - points[1].y);

    /* First Quadrant */
    if (points[1].x > points[0].x && points[1].y > points[0].y) {
      this.newPoints = [
        new Point(points[0].x, points[0].y),
        new Point(points[0].x, points[0].y + leastWidth),
        new Point(points[0].x + leastWidth, points[0].y + leastWidth),
        new Point(points[0].x + leastWidth, points[0].y),
      ];
    } else if (points[1].x < points[0].x && points[1].y > points[0].y) {
      /* Second Quadrant */
      this.newPoints = [
        new Point(points[0].x, points[0].y),
        new Point(points[0].x, points[0].y + leastWidth),
        new Point(points[0].x - leastWidth, points[0].y + leastWidth),
        new Point(points[0].x - leastWidth, points[0].y),
      ];
    } else if (points[1].x < points[0].x && points[1].y < points[0].y) {
      /* Third Quadrant */
      this.newPoints = [
        new Point(points[0].x, points[0].y),
        new Point(points[0].x, points[0].y - leastWidth),
        new Point(points[0].x - leastWidth, points[0].y - leastWidth),
        new Point(points[0].x - leastWidth, points[0].y),
      ];
    } else {
      /* Fourth Quadrant */
      this.newPoints = [
        new Point(points[0].x, points[0].y),
        new Point(points[0].x, points[0].y - leastWidth),
        new Point(points[0].x + leastWidth, points[0].y - leastWidth),
        new Point(points[0].x + leastWidth, points[0].y),
      ];
    }
  }

  draw() {
    /* vertices = points + color */
    let vertices = [];
    for (let point of this.newPoints) {
      vertices.push(
        point.x,
        point.y,
        this.color.red,
        this.color.green,
        this.color.blue
      );
    }

    this.gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      gl.STATIC_DRAW
    );
    this.gl.drawArrays(this.GL_SHAPE, 0, this.newPoints.length);
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
    super(gl, points, color, gl.TRIANGLE_FAN);
    this.newPoints = [
      new Point(points[0].x, points[0].y),
      new Point(points[0].x, points[1].y),
      new Point(points[1].x, points[1].y),
      new Point(points[1].x, points[0].y),
    ];
  }

  draw() {
    /* vertices = points + color */
    let vertices = [];
    for (let point of this.newPoints) {
      vertices.push(
        point.x,
        point.y,
        this.color.red,
        this.color.green,
        this.color.blue
      );
    }

    this.gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      gl.STATIC_DRAW
    );
    this.gl.drawArrays(this.GL_SHAPE, 0, this.newPoints.length);
  }
}

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
    if (this.constructor === Tool) {
      throw new Error(
        'ERROR: Tidak bisa membuat objek dari kelas abstrak "Tool"'
      );
    }
    /** @type HTMLCanvasElement */
    this.canvas = canvas;
    /** @type WebGLRenderingContext */
    this.gl = gl;
    /** @type {{shapes: (Line|Polygon)[], shapeColor: Color, canvasColor: Color}} */
    this.current = current;
  }

  /* Draws the current state */
  drawCanvas() {
    this.gl.clearColor(
      this.current.canvasColor.red,
      this.current.canvasColor.green,
      this.current.canvasColor.blue,
      1
    );
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    for (let shape of this.current.shapes) {
      shape.draw();
    }
  }

  /* Resets the tool (to be overidden by child classes) */
  resetTool() {
    /* pass */
  }

  /*~*~*~* EVENT LISTENERS (and related stuffs) *~*~*~*/

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
    /* Points at the currently active shape (-1 if there's none currently) */
    /** @type number */
    this.activeShapeIndex = -1;
    /** @type Point */
    this.clickPosition = new Point();
    /** @type boolean */
    this.dragging = false;
    /** @type Point[] */
    this.tempPoints = [];
  }

  /**
   * Reset attributes to default values
   */
  resetTool() {
    this.activeShapeIndex = -1;
    this.clickPosition = new Point();
    this.dragging = false;
    this.tempPoints = [];
  }

  /** @param {number} index */
  setActiveShape(index) {
    this.activeShapeIndex = index;
  }

  setActiveShapeColor() {
    if (
      this.activeShapeIndex > -1 &&
      this.activeShapeIndex < this.current.shapes.length
    ) {
      this.current.shapes[this.activeShapeIndex].color.copyColor(
        this.current.shapeColor
      );
    }
  }

  /*~*~*~* EVENT LISTENERS (and related stuffs) *~*~*~*/

  /**
   * @param {Shape} shape
   * @param {Point} cursorPosition
   * @returns {boolean}
   */
  isCursorInside(shape, cursorPosition) {
    /* Construct a square surrounding the shape */
    let minX = shape.points[0].x;
    let minY = shape.points[0].y;
    let maxX = shape.points[0].x;
    let maxY = shape.points[0].y;
    for (let point of shape.points) {
      if (point.x < minX) {
        minX = point.x;
      }
      if (point.x > maxX) {
        maxX = point.x;
      }
      if (point.y < minY) {
        minY = point.y;
      }
      if (point.y > maxY) {
        maxY = point.y;
      }
    }

    /* true if cursor is inside the square */
    if (
      cursorPosition.x >= minX &&
      cursorPosition.x <= maxX &&
      cursorPosition.y >= minY &&
      cursorPosition.y <= maxY
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Bind this to 'click' event
   * Selects the topmost shape
   * @param {MouseEvent} e */
  clickListener(e) {
    this.clickPosition.copyPoint(this.getCursorPosition(e));
    this.tempPoints = [];
    let temp = this.activeShapeIndex;
    this.setActiveShape(-1);
    for (let i = this.current.shapes.length - 1; i > -1; i -= 1) {
      if (this.isCursorInside(this.current.shapes[i], this.clickPosition)) {
        this.setActiveShape(i);
        break;
      }
    }
    if (
      temp > -1 &&
      temp < this.current.shapes.length &&
      temp === this.activeShapeIndex
    ) {
      for (let point of this.current.shapes[temp].points) {
        this.tempPoints.push(new Point(point.x, point.y));
      }
      this.dragging = true;
    }
  }

  /**
   * Bind this to 'mousedown' event
   * Drags the selected shape
   * @param {MouseEvent} e
   */
  mouseDownListener(e) {
    if (
      this.dragging &&
      this.activeShapeIndex > -1 &&
      this.activeShapeIndex < this.current.shapes.length &&
      this.tempPoints.length ===
        this.current.shapes[this.activeShapeIndex].points.length
    ) {
      let dragPosition = this.getCursorPosition(e);
      for (let i = 0; i < this.tempPoints.length; i += 1) {
        this.current.shapes[this.activeShapeIndex].points[i].x =
          this.tempPoints[i].x + (dragPosition.x - this.clickPosition.x);
        this.current.shapes[this.activeShapeIndex].points[i].y =
          this.tempPoints[i].y + (dragPosition.y - this.clickPosition.y);
      }
      this.drawCanvas();
    }
  }

  /**
   * Bind this to 'mouseup' event
   * Ends dragging
   * @param {MouseEvent} e
   */
  mouseUpListener(e) {
    if (this.dragging) {
      this.dragging = false;
      this.tempPoints = [];
      this.drawCanvas();
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
      this.rectangle.draw();
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
      this.rectangle = new Rectangle(
        this.gl,
        [this.rectangle.points[0], this.getCursorPosition(e)],
        this,
        this.current.shapeColor
      );
      this.drawCanvas();
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
      this.square.draw();
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
      this.square = new Square(
        this.gl,
        [this.square.points[0], this.getCursorPosition(e)],
        this,
        this.current.shapeColor
      );
      this.drawCanvas();
      this.square.draw();
    }
  }
}
