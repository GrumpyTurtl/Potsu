var c = document.getElementById("cvs");
var ctx = c.getContext("2d");


var time = {
    deltaTime: 5,
    time: 0,
    totalTime: 1000
}

var a = {
    vertices: [{ x: 0, y: 0 },{ x: 50, y: 0 },{ x: 50, y: 50 },{ x: 0, y: 50 }],
    mass:1,
    angularVelocity: 0,
    velocity: {x:0, y:0},
}
a.center = findCenter(a.vertices);
a.edges = buildEdges(a.vertices);

var b = {
    vertices: [{ x: 0, y: 0 },{ x: 50, y: 0 },{ x: 50, y: 50},{ x: 0, y: 50 }],
    mass:1,
    angularVelocity: 0,
    velocity: {x:0, y:0},
}
b.center = findCenter(b.vertices);
b.edges = buildEdges(b.vertices);

GoTo(b.vertices, 100, 0);
console.log(b.vertices);
render(a.vertices, "red");
render(b.vertices, "blue");

GoTo(b.vertices, 0, 100);
render(b.vertices, "blue");

function Fixedupdate(){
    while(time.time < time.totalTime){
        console.log(testWith(b,a));
        time.time += time.deltaTime;
    }
}


Fixedupdate();

//movement
function offset(vertices,dx, dy) {
    for (let i = 0; i < vertices.length; i++) {
        vertices[i] = {
            x: vertices[i].x + dx,
            y: vertices[i].y + dy,
        };
    }
}

function GoTo(vertices,x,y) {
    let currentPos = vertices;
    for (let i = 0; i < vertices.length; i++) {
        console.log(x, currentPos[i].x, y, currentPos[i].y);
        console.log(x - currentPos[i].x, y - currentPos[i].y);
        vertices[i] = {
            x: x + currentPos[i].x,
            y: y + currentPos[i].y 
        }
    }
};


//math
function calculateVelocityOfPoint(velocity, angularVelocity, distanceVectorFromCenterToPoint){
    let omegaR = {x: (-angularVelocity * distanceVectorFromCenterToPoint.x), y: (angularVelocity * distanceVectorFromCenterToPoint.y), z: 0};
    return {x: velocity.x + omegaR.x, y: velocity.y + omegaR.y};
}

function CrossProduct(a,b){
    return {x:a.y*b.z - a.z * b.y, y:a.z*b.x - a.x * b.z, z:a.x * b.y - ay * b.x};
}

function DotProduct(a,b){
    return {x: a.x * b.x, y: a.y * b.y}
}

function Normal(a){
    return {x:a.y, y: -a.x};
}


//collision
function findCenter(vertices){
    const n = vertices.length;
    let sumX = 0;
    let sumY = 0;

    for(const vertex of vertices){
        sumX += vertex.x;
        sumY += vertex.y;
    }

    return { x: sumX/n, y: sumY/n};
}


function buildEdges(vertices) {
    const edges = [];
    if (vertices.length < 3) {
        console.error("Only polygons supported.");
        return edges;
    }
    for (let i = 0; i < vertices.length; i++) {
        const a = vertices[i];
        let b = vertices[0];
        if (i + 1 < vertices.length) {
            b = vertices[i + 1];
        }
        edges.push({
            x: (b.x - a.x),
            y: (b.y - a.y),
        });
    }
    return edges;
}

function intervalDistance(minA, maxA, minB, maxB) {
    if (minA < minB) {
        return (minB - maxA);
    }
    return (minA - maxB);
}

function projectInAxis(polygon, x, y) {
    let min = 10000;
    let max = -100000;
    for (let i = 0; i < polygon.vertices.length; i++) {
        let px = polygon.vertices[i].x;
        let py = polygon.vertices[i].y;
        var projection = (px * x + py * y) / (Math.sqrt(x * x + y * y));
        if (projection > max) {
            max = projection;
        }
        if (projection < min) {
            min = projection;
        }
    }
    return { min, max };
};

function testWith (polygon, otherPolygon) {
    // get all edges
    const edges = [];
    for (let i = 0; i < polygon.edges.length; i++) {
        edges.push(polygon.edges[i]);
    }
    for (let i = 0; i < otherPolygon.edges.length; i++) {
        edges.push(otherPolygon.edges[i]);
    }
    // build all axis and project
    for (let i = 0; i < edges.length; i++) {
        // get axis
        const length = Math.sqrt(edges[i].y * edges[i].y + edges[i].x * edges[i].x);
        const axis = {
            x: -edges[i].y / length,
            y: edges[i].x / length,
        };
        // project polygon under axis
        const { min: minA, max: maxA } = projectInAxis(polygon, axis.x, axis.y);
        const { min: minB, max: maxB } = projectInAxis(otherPolygon, axis.x, axis.y);
        if (intervalDistance(minA, maxA, minB, maxB) > 0) {
            return false;
        }
    }

    return true;
};

//rendering
function render(vertices, fillColour, borderColour) {
        ctx.fillStyle = borderColour;
        ctx.lineWidth = 10;
        ctx.beginPath();

        for (var i = 0; i < vertices.length; i++) {
            ctx.lineTo(vertices[i].x, vertices[i].y);
        }

        ctx.fillStyle = fillColour;
        ctx.fill();
        ctx.closePath();
}
