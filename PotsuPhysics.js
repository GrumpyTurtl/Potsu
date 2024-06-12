//https://www.toptal.com/game/video-game-physics-part-i-an-introduction-to-rigid-body-dynamics

var c = document.getElementById("cvs");
var ctx = c.getContext("2d");

const d = new Date
var time = {
    deltaTime: d.getTime(),
    time: d.getTime(),
}
class world{
    constructor(){
        this.objects = [];
    }
}

class Vec {
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class BoxCollider{
    constructor(offsetX, offsetY, width, height){

    }
}

class CircleCollider {
    constructor(offsetX, offsetY, radius){

    }
}

class PolyCollider{
    constructor(offsetX, offsetY,vertices){

    }
}

class Rigidbody {
    constructor(collider){
        this.collider = collider;

        this.mass = 1;

        this.acceleration;
        this.rotationalAcceleration;

        this.velocity = new Vec(0,0,0);
        this.rotationalVelocity;

        this.position = new Vec(0,0,0);
        this.rotation;


        this.update = function (){
            time.deltaTime = d.getTime() - time.time;
        }

        this.draw = function (){

        }


    }


}


function checkCollision(a,b){
    if(a.collider == BoxCollider){

    }

    if(a.collider == CircleCollider){

    }

    if(a.collider == PolyCollider){

    }

    if(a.collider[0]){

    }
}

function SAT(){
//just make aabb's into sats

}

function CircleOnCircle(){

}

function AABBOnAABB(){

}

function AABBOnCircle(){

}

