//https://stackoverflow.com/questions/36784456/calculating-angular-velocity-after-a-collision
//http://www.chrishecker.com/Rigid_Body_Dynamics

//https://www.myphysicslab.com/engine2D/collision-en.html

//https://eugkenny.github.io/GADV8001/lectures/

var c = document.getElementById('cvs');
var ctx = c.getContext('2d');


var time = {
    deltaTime: 1,
    time: 0,
    totalTime:0
}

class body {
    constructor(){
        this.damping = 1;
        this.velocity = {x:0, y: 0};
        this.acceleration = {x:10, y: 9.8};
        this.position = {x:0, y: 0};
        this.mass = 10;

    }
}

var a = new body;

var Math = {
    addVectors2d: function (a = {},b = {}) {return {x:a.x + b.x, y:a.y + b.y}},
    addVectors3d: function (a = {},b = {}) {return {x:a.x + b.x, y:a.y + b.y, z:a.z + b.z}},
    multiplyVectors2d: function (a = {},b = {}) {return {x:a.x * b.x, y:a.y * b.y}},
    multiplyVectors3d: function (a = {},b = {}) {return {x:a.x * b.x, y:a.y * b.y, z:a.z * b.z}},
    addNumToVector2d: function (a = {},b = 0) {return {x:a.x + b, y:a.y + b}},
    addNumToVector3d: function (a = {},b = 0) {return {x:a.x + b, y:a.y + b, z:a.z + b}},
    multiplyVectorByNum2d: function (a = {},b = 0) {return {x:a.x * b, y:a.y * b}},
    multiplyVectorByNum3d: function (a = {},b = 0) {return {x:a.x * b, y:a.y * b, z:a.z * b}},
    computeForce: function (x,y, mass) {return {x:x * mass, y: y * mass}}
}

var arr = [];

function step(){
    
    let force = Math.computeForce(3,9.8,a.mass);
    a.acceleration = {x:force.x / a.mass, y: force.y / a.mass};
    a.velocity = Math.addVectors2d(a.velocity, Math.multiplyVectorByNum2d(a.acceleration, time.deltaTime))
    //a.velocity = Math.multiplyVectorByNum2d(a.velocity, a.damping);
    //if(a.velocity.x < 0.01){a.velocity.x = 0} if(a.velocity.x < 0.01){a.velocity.y = 0}
    a.position = Math.addVectors2d(a.position, Math.multiplyVectorByNum2d(a.velocity, time.deltaTime));

    time.time += time.deltaTime;
    console.log(a.position);
    arr.push(a.position);

    ctx.fillStyle = "black";
    ctx.fillRect(a.position.x - 3, a.position.y - 3, 6,6);

    ctx.fillstyle = "green";
    ctx.beginPath();
    ctx.moveTo(arr[0].x, arr[0].y);
    for(let i = 1; i < arr.length; i++){
        ctx.lineTo(arr[i].x, arr[i].y);
    }
    ctx.stroke();
}

for(let i = 0; i < 100; i++){
    step();
}