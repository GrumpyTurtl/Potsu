//https://www.toptal.com/game/video-game-physics-part-i-an-introduction-to-rigid-body-dynamics

var c = document.getElementById("cvs");
var ctx = c.getContext("2d");

class particle {
    constructor(){
        this.position = {x:0, y:0};
        this.velocity = {x:0, y:0};
        this.mass = 10;
    }
}

var particles = [new particle,new particle,new particle,new particle,new particle];

function PrintParticles(){
    for (let i = 0; i < particles.length; i++) {
        console.log("Particle:", i, "Position:", particles[i].position, "Velocity:", particles[i].velocity);
        ctx.fillStyle = "Purple";
        ctx.fillRect(particles[i].position.x, particles[i].position.y, 5, 5);
        ctx.strokeStyle = "Green";
        ctx.beginPath()
        ctx.moveTo(particles[i].position.x, particles[i].position.y);
        ctx.lineTo(particles[i].position.x + particles[i].velocity.x, particles[i].position.y + particles[i].velocity.y);
        ctx.stroke();
    }   
}

function InitialiseParticles(){
    for (let i = 0; i < particles.length; i++) {
        particles[i].position = {x: Math.random() * 10, y: Math.random() * 10}
        particles[i].velocity = {x:0, y:0};
        particles[i].mass = 1;
    }
}

function ComputeForce(object){
    return {x: Math.random() * 10, y: object.mass * 9.81};
}

function RunSimulation() {
    let time = {
        totalTime: 100,
        time: 0,
        deltaTime: 1
    }
    InitialiseParticles();
    PrintParticles();

    while (time.time < time.totalTime){
            for(let i = 0; i < particles.length; i++){
                let force = ComputeForce(particles[i]);
                let acceleration = {x: force.x / particles[i].mass, y: force.y / particles[i].mass};
                
                particles[i].velocity.x += acceleration.x * time.deltaTime;
                particles[i].velocity.y += acceleration.y * time.deltaTime;

                particles[i].position.x += particles[i].velocity.x * time.deltaTime;
                particles[i].position.y += particles[i].velocity.y * time.deltaTime;
            }

            PrintParticles();
            time.time += time.deltaTime;
                    
    }

}

RunSimulation();

class RigidBody {
    constructor(){
        this.position = {x:null, y:null};
        this.linearVelocity = {x:null, y:null};
        this.angle;
        this.angularVelocity;
        this.force = {x:null, y:null};
        this.torque;
        this.shape = new BoxShape;
    }
}

class BoxShape {
    constructor(){
        this.width;
        this.height;
        this.mass;
        this.momentOfinertia;
    }
}

function CalculateBoxInertia(objectShape){
    let m = objectShape.mass;
    let w = objectShape.width;
    let h = objectShape.height;
    objectShape.momentOfinertia = m * (w * w + h * h) / 12;
}

var rigidbodies = [new RigidBody, new RigidBody, new RigidBody, new RigidBody, new RigidBody, new RigidBody];

function PrintRigidBodies(){
    ctx.fillStyle = "Black"
    for(let i = 0; i < rigidbodies.length; i++){
        console.log("RigidBody:",i,"Position:", rigidbodies[i].position, "Angle:", rigidbodies[i].angle);
        ctx.fillRect(rigidbodies[i].position.x, rigidbodies[i].position.y, rigidbodies[i].shape.width, rigidbodies[i].shape.height);
        ctx.strokeStyle = "Green";
        ctx.beginPath()
        ctx.moveTo(rigidbodies[i].position.x, rigidbodies[i].position.y);
        ctx.lineTo(rigidbodies[i].position.x + rigidbodies[i].linearVelocity.x, rigidbodies[i].position.y + rigidbodies[i].linearVelocity.y);
        ctx.stroke();
    }
}

function InitialiseRigidBodies(){
    for(let i = 0; i < rigidbodies.length; i++){
        let rb = rigidbodies[i];
        rb.position = {x: Math.random() * 50, y: Math.random() * 50};
        rb.angle = (Math.random() * 360) / 360 * Math.PI * 2;
        rb.linearVelocity = {x:Math.random() * 20, y:0};
        rb.angularVelocity = 0;

        rb.shape.mass = 10;
        rb.shape.width = 1 + Math.random() * 20;
        rb.shape.height = 1 + Math.random() * 20;
        CalculateBoxInertia(rb.shape);
    }
}

function ComputeForceAndTorque(rb){
    let f = {x:0, y: 9.81};
    rb.force = f;
    let r = {x:rb.shape.width/2, y: rb.shape.height/2}
    rb.torque = r.x * f.y - r.y * f.x;
}

function RunRigidBodySimulation(){
    let time = {
        totalTime: 10,
        time: 0,
        deltaTime: 1
    };
    
    InitialiseRigidBodies();
    PrintRigidBodies();

    while (time.time < time.totalTime) {
            for(let i = 0; i < rigidbodies.length; i++){
                let rb = rigidbodies[i];
                ComputeForceAndTorque(rb);

                let linearAcceleration = {x: rb.force.x/rb.shape.mass, y: rb.force.y/rb.shape.mass};
                rb.linearVelocity.x += linearAcceleration.x * time.deltaTime;
                rb.linearVelocity.y += linearAcceleration.y * time.deltaTime;

                rb.position.x += rb.linearVelocity.x * time.deltaTime;
                rb.position.y += rb.linearVelocity.y * time.deltaTime;

                let anglularAcceleration = rb.torque / rb.shape.momentOfinertia;
                rb.angularVelocity += anglularAcceleration * time.deltaTime;
                rb.angle += rb.angularVelocity * time.deltaTime;
            }

            PrintRigidBodies();
            time.time += time.deltaTime;
    }
}

RunRigidBodySimulation();