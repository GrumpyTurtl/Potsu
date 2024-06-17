#include "Potsu.hpp"
#include <iostream>

int main(){
    World World;
    RigidBody* rb = World.CreateRigidBody();
    rb->CreateSquareCollider();
    rb->mass = 10;
    
    std::cout << rb->mass << "\n" << rb->position.x << "\n" << rb->position.y << std::endl;
}