#include "Potsu.hpp"
#include <iostream>

int main(){
    Object A;
    AABB ACollider;
    A.velocity.x = 0;
    A.velocity.y = 0;
    A.restitution = 0.8;
    ACollider.min.x = 0;
    ACollider.min.y = 0;
    ACollider.max.x = 10;
    ACollider.max.y = 10;


    Object B;
    AABB BCollider;

    B.velocity.y = 0;
    B.restitution = 0.8;
    BCollider.min.x = 1;
    BCollider.min.y = 1;
    BCollider.max.x = 11;
    BCollider.max.y = 11;

    Manifold M;
    M.A = A;
    M.B = B;
    M.penetration = 10;
    M.normal.x = 1;
    M.normal.y = 0;

    cout << AABBvsAABB(ACollider, BCollider);
}