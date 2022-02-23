//Init
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("webgl-app");
const gl = canvas.getContext("webgl2", { preserveDrawingBUffer: true });
if (!gl) {
  alert("Your browser does not support WebGL");
}

//Prepare web GL engine
function prepGL() {
  gl.viewport(0, 0, canvas.width, canvas.height);
  // gl.clearColor(1, 1, 1, 1);
  // gl.clear(gl.COLOR_BUFFER_BIT);

  //define shaders
  const vert = `precision mediump float; 
  attribute vec2 vertPos; //vertPosition
  attribute vec3 vertColor; //vertColor
  varying vec3 fragmentColor;

  void main() {
    fragmentColor = vertColor;
    gl_Position = vec4(vertPos, 0, 1);
  }`;

  const frag = `precision mediump float;

  varying vec3 fragmentColor;
  void main() {
    gl_FragColor = vec4(fragmentColor, 1.0);
  }`;

  //incorporate shaders to webGL
  //Vertex shader
  const vertShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertShader, vert);
  gl.compileShader(vertShader);
  //validate
  if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling vertex shader!",
      gl.getShaderInfoLog(vertShader)
    );
  } else {
    console.log("Vertex shader compile success");
  }

  //Fragment shader
  const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragShader, frag);
  gl.compileShader(fragShader);
  //validate
  if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling frag shader!",
      gl.getShaderInfoLog(fragShader)
    );
  } else {
    console.log("Fragment shader compile success");
  }

  //create shader program
  program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);
  //validate program
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ERROR linking program!", gl.getProgramInfoLog(program));
  } else {
    console.log("Linking program success");
  }
}

prepGL();

//sample data
// const triangle = [
//   0.0, 0.0, 0.0, 0.0, 0.0,
//   0.0, 0.5, 0.0, 0.0, 0.0,
//   0.5, 0.0, 0.0, 0.0, 0.0,
// ];

//binding data
const vertBuf = gl.createBuffer(); //container buat nyimpen data (vertex+color)
gl.bindBuffer(gl.ARRAY_BUFFER, vertBuf); //binding ke web gl

//get attribute location
let positionAttLoc = gl.getAttribLocation(program, "vertPos");
let colorAttLoc = gl.getAttribLocation(program, "vertColor");

// tell WebGL how to read raw data
gl.vertexAttribPointer(
  positionAttLoc, //Attribute location
  2, // number of elements per attribute
  gl.FLOAT, //type of elements
  gl.FALSE,
  5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
  0 // Offset from the beginning of a single vertex to this attribute
);

gl.vertexAttribPointer(
  colorAttLoc, //Attribute location
  3, // number of elements per attribute
  gl.FLOAT, //type of elements
  gl.FALSE,
  5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
  2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
);

gl.enableVertexAttribArray(positionAttLoc);
gl.enableVertexAttribArray(colorAttLoc);

gl.useProgram(program);

// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle), gl.STATIC_DRAW); //pas mau gambar
// gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);