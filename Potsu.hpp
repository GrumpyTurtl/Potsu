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

struct AABB{
    Vec2 min;
    Vec2 max;
};

struct Circle{
    float radius;
    Vec2 position;
};

struct Object{
    Vec2 velocity;
    float restitution;
    float mass = 1;
    if(mass == 0){
        float invMass = 0;
    }else{
        float invMass = 1 / mass;
    }
    
}

struct Manifold{
    Object *A;
    Object *B;
    float penetration;
    Vec2 normal;
};

float DotProduct(Vec2 A, Vec2 B){

}


bool AABBvsAABB(AABB a, AABB b){
    if(a.max.x < b.min.x || a.min.x > b.max.x) return false;
    if(a.max.y < b.min.y || a.min.y > b.max.y) return false;

    return true;
}

bool CircleVsCircle(Manifold *m){
    Object *A = m->A;
    Object *B = m->B;

    Vec2 n = B->position - A->position;

    float r = a.radius + b.radius;
    r *= r;
    
    if(n^2 > r){
        return false;
    }

    if(n != 0){
        
        m->penetration = r - n;

        m->normal =  r / n;
        return true;
    }else{
        m->penetration = A->radius;
        m->normal = Vec2(1,0);
        return true;
    }

}


void PositionalCorrection( Object A, Object B )

{

  const float percent = 0.2 // usually 20% to 80%

  const float slop = 0.01 // usually 0.01 to 0.1

  Vec2 correction = max( penetration - slop, 0.0f ) / (A.inv_mass + B.inv_mass)) * percent * n

  A.position -= A.inv_mass * correction

  B.position += B.inv_mass * correction

}


void ResolveCollision(Object A, Object B, Vec2 normal){
    Vec2 rv = B.velocity - A.velocity;

    float velAlongNormal = DotProduct(rv, normal);

    if(velAlongNormal > 0){
        return;
    }
    
    float e = min(A.restitution, B.restitution);

    float j = -(1 + e) * velAlongNormal;
    j /= A.invMass + B.invMass;

    Vec2 impulse = j * normal;
    float mass_sum = A.mass + B.mass

    float ratio = A.mass / mass_sum
    A.velocity -= ratio * impulse

    ratio = B.mass / mass_sum
    B.velocity += ratio * impulse

}

