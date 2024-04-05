//https://stackoverflow.com/questions/36784456/calculating-angular-velocity-after-a-collision


//https://www.myphysicslab.com/engine2D/collision-en.html

var c = document.getElementById("cvs");
var ctx = c.getContext("2d");


var time = {
    deltaTime: 1,
    time: 0,
    totalTime: 1000
}

var a = {
    vertices: [{ x: 0, y: 0 },{ x: 50, y: 0 },{ x: 50, y: 50 },{ x: 0, y: 50 }],
    position: {x:0,y:0},
    acceleration: {x:0,y:0},
    force: {x:0, y:0.981},
    mass:1,
    angularVelocity: 0,
    velocity: {x:0, y:0},
    intertia:100,
}
a.centerOfMass = findCenter(a);
a.edges = buildEdges(a);

var b = {
    vertices: [{ x: 0, y: 0 },{ x: 50, y: 0 },{ x: 50, y: 50},{ x: 0, y: 50 }],
    position: {x:0,y:0},
    mass:1,
    angularVelocity: 0,
    velocity: {x:0, y:0},
    intertia:100,
}
b.centerOfMass = findCenter(b);
b.edges = buildEdges(b);

b.position = {x:45, y:150};

function Fixedupdate(){
    if(time.time > time.totalTime){
        return;
    }

    ctx.clearRect(0,0,4000,40000);
    if(testWith(a,b)){
        console.log("COLLISION _______________________________________________");
        render(a, "green");
        render(b, "blue");

        let normal = calculateNormal2D(a.vertices);
        let PointVelocity = calculateVelocityOfPoint(a.velocity,a.angularVelocity,{x:0,y:25});

        let reaction = ImpulseParameter(0.8,PointVelocity,normal,a.mass,b.mass,{x:0,y:25},{x:0,y:25},a.intertia,b.intertia);



        a.velocity.x += -reaction.x;
        a.velocity.y += -reaction.y;

        b.velocity.x += reaction.x;
        b.velocity.y += reaction.y;


    }else{
        render(a, "red");
        render(b, "blue");
    } 
    a.acceleration = {x:a.force.x/a.mass, y: a.force.y/a.mass};

    a.velocity.x += a.acceleration.x * time.deltaTime;
    a.velocity.y += a.acceleration.y * time.deltaTime;

    a.position.x += a.velocity.x * time.deltaTime;
    a.position.y += a.velocity.y * time.deltaTime;

    time.time += time.deltaTime;
}

setInterval(Fixedupdate, time.deltaTime);


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

function calculateNormal2D(vertices, magnitude = 1) {
    if (vertices.length < 3) {
        console.error("At least three vertices are required to calculate a normal vector.");
        return null;
    }

    const vector = {
        x: vertices[1].x - vertices[0].x,
        y: vertices[1].y - vertices[0].y
    };

    const normal = {
        x: -vector.y,
        y: vector.x
    };

    const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
    normal.x /= length;
    normal.y /= length;

    normal.x *= magnitude;
    normal.y *= magnitude;

    return normal;
}



//collision
function ImpulseParameter(elasticity,vp, normal, massA, massB, distanceToImpactA, distanceToImpactB, InertiaA, InertiaB){
    let tmp1 = {x:-(1 + elasticity) * (vp.x * normal.x), y:-(1 + elasticity) * (vp.y * normal.y)};
    let tmp2 = {
        x:1/massA + 1/massB + (distanceToImpactA.x * normal.x)**2 / InertiaA + (distanceToImpactB.x * normal.x)**2 / InertiaB,
        y:1/massA + 1/massB + (distanceToImpactA.y * normal.y)**2 / InertiaA + (distanceToImpactB.y * normal.y)**2 / InertiaB
    }
    let j = {x:tmp1.x/tmp2.x, y: tmp1.y/tmp2.y};
    return j;
}

function findCenter(obj){
    const n = obj.vertices.length;
    let sumX = 0;
    let sumY = 0;

    for(const vertex of obj.vertices){
        sumX += vertex.x + obj.position.x;
        sumY += vertex.y + obj.position.y;
    }

    return { x: sumX/n, y: sumY/n};
}


function buildEdges(obj) {
    const edges = [];
    if (obj.vertices.length < 3) {
        console.error("Only polygons supported.");
        return edges;
    }
    for (let i = 0; i < obj.vertices.length; i++) {
        const a = obj.vertices[i];
        let b = obj.vertices[0];
        if (i + 1 < obj.vertices.length) {
            b = obj.vertices[i + 1];
        }
        edges.push({
            x: (b.x + obj.position.x - a.x + obj.position.x),
            y: (b.y + obj.position.y - a.y + obj.position.y)
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
        let px = polygon.vertices[i].x + polygon.position.x;
        let py = polygon.vertices[i].y + polygon.position.y;
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
function render(obj, fillColour, borderColour) {
        ctx.fillStyle = borderColour;
        ctx.lineWidth = 10;
        ctx.beginPath();

        for (var i = 0; i < obj.vertices.length; i++) {
            ctx.lineTo(obj.vertices[i].x + obj.position.x, obj.vertices[i].y + obj.position.y);
        }

        ctx.fillStyle = fillColour;
        ctx.fill();
        ctx.closePath();
}
