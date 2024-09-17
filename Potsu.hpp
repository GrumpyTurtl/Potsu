#pragma once
#include <iostream>
#include <vector>
#include <cmath>



struct Vec2{
    float x;
    float y;
};

struct Vec3{
    float x;
    float y;
    float z;
};

struct BoxObject {
    Vec2 min;
    Vec2 max;
    Vec2 velocity;
    float restitution;
    float mass = 1;
};

BoxObject(){

}

bool AABBvsAABB(BoxObject a, BoxObject b){
    if(a.max.x < b.min.x || a.min.x > b.max.x) return false;
    if(a.max.y < b.min.y || a.min.y > b.max.y) return false;

    return true;
}

while(true){

}

