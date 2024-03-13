/*

This Library contains Advanced collision Detection(Seperating Axis Theorum)
And physics tool's for easy Game Development across multiple Games

-Copyright-
this program is *definitely* under hundreds of copyright restrictions

*/

/*
shape vertices:

square = [
  { x: 0, y: 0 },
  { x: 50, y: 0 },
  { x: 50, y: 50 },
  { x: 0, y: 50 }
];

triangle = [
  { x: 25, y: 0 },
  { x: 50, y: 50 },
  { x: 0, y: 50 }
];

hexagon = [
  { x: 30, y: 0 },
  { x: 60, y: 20 },
  { x: 60, y: 50 },
  { x: 30, y: 70 },
  { x: 0, y: 50 },
  { x: 0, y: 20 }
];

octagon = [
  { x: 20, y: 0 },
  { x: 50, y: 0 },
  { x: 70, y: 20 },
  { x: 70, y: 50 },
  { x: 50, y: 70 },
  { x: 20, y: 70 },
  { x: 0, y: 50 },
  { x: 0, y: 20 }
];

pentagon = [
  { x: 25, y: 0 },
  { x: 50, y: 18 },
  { x: 42, y: 50 },
  { x: 8, y: 50 },
  { x: 0, y: 18 }
];

*/

var ctx;
var Allobjects = [];
var c;
var time = 0;
setInterval(TimeCounter, 1);
function TimeCounter(){
    time++;
}

function canvas(CanvasId){
    c = document.getElementById(CanvasId);
    ctx = c.getContext("2d");
    return ctx;
}


/**
 add params here

**/

class GameObject {
    constructor(hitboxVertices, image, width, height, rotation, collider, tag){
        this.image = image;
        this.width = width;
        this.height = height;
        this.rotation = rotation
        this.vertOrigin = hitboxVertices;
        this.vertices = this.vertOrigin;
        this.x = this.vertices[0].x;
        this.y = this.vertices[0].y;
        this.collider = collider;
        this.tag = tag;

        this.edges = buildEdges(this.vertices);
        this.velocity = {x:0,y:0};
        this.mass = 1;
        this.lockVelocity = {x:false, y:false};
        this.LockRotation = false;
        this.objects = Allobjects;
        

        this.addObjectToArray = function(){
            if(Allobjects){
                Allobjects.push(this);
            }else{
                console.error("ALLobject or objects variable not found")
            }
        }
        
        this.addObjectToArray();
        //collision
        this.projectInAxis = function (x, y) {
            let min = 10000;
            let max = -100000;
            for (let i = 0; i < this.vertices.length; i++) {
                let px = this.vertices[i].x;
                let py = this.vertices[i].y;
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


        this.testWith = function (otherPolygon) {
            if(this == otherPolygon){
                return false;
            }
            // get all edges
            const edges = [];
            for (let i = 0; i < this.edges.length; i++) {
                edges.push(this.edges[i]);
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
                const { min: minA, max: maxA } = this.projectInAxis(axis.x, axis.y);
                const { min: minB, max: maxB } = otherPolygon.projectInAxis(axis.x, axis.y);
                if (intervalDistance(minA, maxA, minB, maxB) > 0) {
                    return false;
                }
            }
            if(otherPolygon.collider == "collider"){
                return true;
            }else{
                return false;
            }
        };

        this.testGroup = function(array){
            var collide = [];
            for(var i = 0; i < array.length; i++){
                collide.push(this.testWith(array[i]));
            }
            return collide;
        };

        this.testWithTag = function(tag){
            
        };

        //render
        this.renderImage = function() {
            if(ctx === null){
                console.error("No CanvasRenderingContext2D applied");
            }else{
            ctx.drawImage(this.image,this.vertices[1].x,this.vertices[1].y,this.width,this.height);
            }
        };

        this.render = function(fillColour, borderColour) {
            if (ctx === null) {
                console.error("No CanvasRenderingContext2D applied");
            } else {
                ctx.fillStyle = borderColour;
                ctx.lineWidth = 10;
                ctx.beginPath();
        
                for (var i = 0; i < this.vertices.length; i++) {
                    ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
                }

                ctx.fillStyle = fillColour;
                ctx.fill();
                ctx.closePath();
            }
        };
        
            this.clone = function (amount) {
                var clones = [];
                for (let i = 0; i < amount; i++) {
                    // Create a new instance with the same properties as the original object
                    const clone = this
                    clones.push(clone);
                }
                return clones;
            }

        this.offset = function(dx, dy) {
            for (let i = 0; i < this.vertices.length; i++) {
                this.vertices[i] = {
                    x: this.vertices[i].x + dx,
                    y: this.vertices[i].y + dy,
                };
            }
        };

        this.goTo = function(x,y) {
            for (let i = 0; i < this.vertices.length; i++) {
                this.vertices[i] = {
                    x: this.vertOrigin[i].x + x,
                    y: this.vertOrigin[i].y + y
                }
            }
        };

        this.CreateRigidboy = function(mass, gravity, LockRotation = false, lockVelocity = {x:false, y:false}, ){
            this.mass = mass;
            this.gravity = gravity;
            this.lockVelocity = lockVelocity;
            this.LockRotation = LockRotation;

            setInterval(() => this.physicsLoop(), 1);
            
        };

        this.physicsLoop  = function(){
            

            if(this.collider == "collider"){
                for (let index = 0; index < this.objects.length; index++) {
                    if(this.testWith(this.objects[i])){
                        if(this.objects[i].collider == "collider"){
                            let v = this.calculateCollisionVelocity(this.objects[i]);
                            this.velocity.x = v.obj1.x;
                            this.velocity.y = v.obj1.y;

                        }else if(this.objects[i].collider == "trigger"){
                            console.log("idk")
                        }
                    }
                }
            }
            this.offset(this.velocity.x, this.velocity.y);
        };

        this.rotate = function(degrees){
            let center = findCenter(this.vertices);
            let radians = degrees * Math.PI/180;

            for (let i = 0; i < this.vertices.length; i++) {
                this.vertices[i] = rotateVertex(this.vertices[i], center, radians);
            }
        };
        this.rotate(rotation);
        
        this.calculateCollisionVelocity = function (obj2){
            let totalMass = obj2.mass + this.mass

            let v1x = ((this.mass - obj2.mass) * this.velocity.x + 2 * obj2.mass * obj2.velocity.x) / totalMass;
            let v1y = ((this.mass - obj2.mass) * this.velocity.y + 2 * obj2.mass * obj2.velocity.y) / totalMass;
            let v2x = ((obj2.mass - this.mass) * obj2.velocity.x + 2 * this.mass * this.velocity.x) / totalMass;
            let v2y = ((obj2.mass - this.mass) * obj2.velocity.y + 2 * this.mass * this.velocity.y) / totalMass;
            
            return {obj1: {x:v1x, y:v1y}, obj2: {x:v2x, y:v2y}}
        }


    }
    
}


// gameLoops And stuff
function SetLoopSpeed(functionName, interval){
    setInterval(functionName, interval);
}

function clear(){
    ctx.clearRect(0,0,c.width, c.height)
}


//collision detection SAT

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

//custom

    function makeHitBox(){
        var a;
        var i = 0;
        window.addEventListener(mousedown, e=> {
            if(i = 0){
                var originX = e.clientX;
                var originY = e.clientY;
                a[i].x = 0;
                a[i].y = 0;
            }else{
            a[i].x = e.clientX - originX;
            a[i].y = e.clientY - originY;
            }
            i++;
        });
        window.addEventListener("keydown", (event) => {
            if(event.key == " "){
                return a;
            }
          });
    }

    function rotateVertex(vertex, center, angle) {
        const xDiff = vertex.x - center.x;
        const yDiff = vertex.y - center.y;
      
        const xNew = center.x + xDiff * Math.cos(angle) - yDiff * Math.sin(angle);
        const yNew = center.y + xDiff * Math.sin(angle) + yDiff * Math.cos(angle);
      
        return { x: xNew, y: yNew };
      }
      
    
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
