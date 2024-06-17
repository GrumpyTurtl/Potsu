#pragma once
#include <iostream>
#include <vector>

struct Vec2{
    int x;
    int y;
};

struct Vec3{
    int x;
    int y;
    int z;
};

// struct PolygonCollider{

// }

struct SquareCollider{
    Vec2 offset = {0,0};
    int width;
    int Height;
};

struct CircleCollider{
    int radius;
};

class StaticBody{

};

class RigidBody{
public:

        void CreateSquareCollider(){
            SquareCollider Collider;
        }

        void CreateCircleCollider(){
            CircleCollider Collider;
        }

        int mass;
        Vec2 position;
        Vec3 velocity;
        Vec3 acceleration;

private:

};

struct Physics{
public: 
    double DotProduct(){

    }

    void ResolveCollision(RigidBody A, RigidBody B){
        Vec2 rv = B.velocity - A.velocity;

        float velAlongNormal = 
    }
}


class World{
public:
    std::vector<RigidBody*> RigidBodyObjects;
    std::vector<StaticBody*> StaticObjects;

    RigidBody* CreateRigidBody() {
        RigidBody* newRigidBody = new RigidBody;  // Allocate memory dynamically
        RigidBodyObjects.push_back(newRigidBody);  // Add pointer to the container
        return newRigidBody;                         // Return the pointer
    }

    StaticBody* CreateStaticBody() {
        StaticBody* newStaticBody = new StaticBody;
        StaticObjects.push_back(newStaticBody);
        return newStaticBody;
    }
};

