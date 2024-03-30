//https://www.toptal.com/game/video-game-physics-part-i-an-introduction-to-rigid-body-dynamics
class particle {
    constructor(){
        this.position = {x:0, y:0};
        this.velocity = {x:0, y:0};
        this.mass = 10;
    }
}

var particles = [new particle];

function PrintParticles(){
    for (let i = 0; i < particles.length; i++) {
        console.log("Particle:", i, "Position:", particles[i].position, "Velocity:", particles[i].velocity);
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
    return {x:0, y: object.mass * 9.81};
}

function RunSimulation() {
    var time = {
        totalTime: 10,
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