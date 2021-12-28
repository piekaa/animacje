attribute vec2 vertexPosition;

uniform mat3 transformation;
uniform mat3 view;

void main() {
    vec3 vp = vec3(vertexPosition.x, vertexPosition.y, 1);
    vp = vp * transformation * view;
    gl_Position = vec4(vp.x, vp.y, 0,   1);
}