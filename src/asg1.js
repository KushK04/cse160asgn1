// HelloPoint1.js
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' + 
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const STARS = 3;

let canvas;
let gl;
let a_Position;
let u_FragColor;
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_segmentCount = 10;
//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes = [];
var g_shapesList = [];

function setupWebGL(){
    canvas = document.getElementById('webgl');
   //gl = getWebGLContext(canvas);
   gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    if (!gl){
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }     

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }    
}

function convertCoordinatesEventToGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();
  
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    
    return ([x,y]);
}

function renderAllShapes(){
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    //var len = g_points.length;
    var len = g_shapesList.length;

    for(var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }
}

function changeColor(color){
    gl.uniform4f(u_FragColor, color[0], color[1], color[2], 1);
}

function drawShield(){
    g_shapesList=[]; 
    renderAllShapes();
    changeColor([0.4,0.4,0.4]);
    drawTriangle([0,0.95,-0.8,0.7,0,0.7]);
    drawTriangle([0,0.95,0.8,0.7,0,0.7]);
    drawTriangle([-0.8,0.2,-0.8,0.7,0,0.7]);
    drawTriangle([-0.8,0.2,0,0.2,0,0.7]);
    drawTriangle([0.8,0.2,0.8,0.7,0,0.7]);
    drawTriangle([0.8,0.2,0,0.2,0,0.7]);
    drawTriangle([0.8,0.2,0,0.2,0,0.7]);
    drawTriangle([0,-0.9,0,0.2,-0.8,0.2]);
    drawTriangle([0,-0.9,0,0.2,0.8,0.2]);

    changeColor([0,0,0.8]);
    drawTriangle([0,0.85,-0.7,0.7,0,0.7]);
    drawTriangle([0,0.85,0.7,0.7,0,0.7]);
    drawTriangle([-0.7,0.2,-0.7,0.7,0,0.7]);
    drawTriangle([0.7,0.2,0.7,0.7,0,0.7]);
    drawTriangle([-0.7,0.2,0,0.7,0,0.2]);
    drawTriangle([0.7,0.2,0,0.7,0,0.2]);
    drawTriangle([-0.7,0.2,0,-0.8,0,0.2]);
    drawTriangle([0.7,0.2,0,-0.8,0,0.2]);

    changeColor([0.8,0.5,0.2]);
    drawTriangle([0,-0.6,-0.2,-0.3,0.2,-0.3]);

    changeColor([1,0,0]);
    drawTriangle([0,-0.15,-0.5,0.15,0.5,0.15]);
    drawTriangle([0,-0.15,-0.5,0.15,0.5,0.15]);
    drawTriangle([-0.3,-0.12,-0.35,0.15,0,0]);
    drawTriangle([0.3,-0.12,0.35,0.15,0,0]);

    changeColor([1,1,0]);
    drawTriangle([0,0.7, -0.3,0.3, 0.3, 0.3]);

    changeColor([0,0,1]);
    drawTriangle([0,0.3, -0.15,0.5, 0.15, 0.5]);   
    
    changeColor([0.4,0.4,0.4]);
    drawTriangle([-0.3,0.75, -0.3,0.55, -0.6, 0.35]);  
    drawTriangle([0.3,0.75, 0.3,0.55, 0.6, 0.35]);  
}

function addActionsForHTMLUI(){
    //Issue with green and blue, had to switch g_sel indices for them & change on mouseup to input
    document.getElementById("segSlide").addEventListener('input', function(){g_segmentCount = this.value;});
    document.getElementById("redSlide").addEventListener('input', function(){g_selectedColor[0] = this.value/100;});
    document.getElementById("greenSlide").addEventListener('input', function(){g_selectedColor[2] = this.value/100;});
    document.getElementById("blueSlide").addEventListener('input', function(){g_selectedColor[1] = this.value/100;});
    document.getElementById("sizeSlide").addEventListener('input', function(){g_selectedSize = this.value;});
    document.getElementById("alphaSlide").addEventListener('input', function(){g_selectedColor[3] = this.value/100;});
    document.getElementById("pointButton").onclick = function(){g_selectedType=POINT};
    document.getElementById("triangleButton").onclick = function(){g_selectedType=TRIANGLE};
    document.getElementById("circleButton").onclick = function(){g_selectedType=CIRCLE};
    document.getElementById("starButton").onclick = function(){g_selectedType=STARS};
    document.getElementById("clearButton").onclick = function(){g_shapesList=[]; renderAllShapes();};
    document.getElementById("pictureButton").onclick = function(){drawShield();};

}

function main() {

    setupWebGL();

    connectVariablesToGLSL();

    addActionsForHTMLUI();  

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) { if(ev.buttons == 1) {click(ev)}};

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
 }

function click(ev) {

    let [x,y] = convertCoordinatesEventToGL(ev);

    let point;
    if (g_selectedType == POINT){
        point = new Point();
    } else if(g_selectedType == TRIANGLE){
        point = new Triangle();
    } else if (g_selectedType == CIRCLE){
        point = new Circle();
        point.segments = g_segmentCount;
    } else {
        point = new Star();
    }
    point.position = [x,y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    g_shapesList.push(point);

//    g_points.push([x, y]);
//    g_colors.push(g_selectedColor.slice());
//    g_sizes.push(g_selectedSize);

//  // Store the coordinates to g_points array
//  if (x >= 0.0 && y >= 0.0) {      // First quadrant
//    g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
//  } else if (x < 0.0 && y < 0.0) { // Third quadrant
//    g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
//  } else {                         // Others
//    g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
//  }

    renderAllShapes();
}