attribute vec2 vertexPosition;
attribute vec2 vertexTextureCoordinate;

uniform mat3 transformation;
uniform mat3 screen;

varying vec2 texcoord;

void main() {
    vec3 vp = vec3(vertexPosition.x, vertexPosition.y, 1);
    vp = vp * transformation * screen;
    gl_Position = vec4(vp.x, vp.y, 0, 1);
    texcoord = vertexTextureCoordinate;
}