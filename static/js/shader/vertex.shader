attribute vec4 vertexPosition;

uniform vec2 screen;

void main() {

    float x = vertexPosition.x * 2.0 / screen.x - 1.0;
    float y = vertexPosition.y * 2.0 / screen.y - 1.0;

    gl_Position = vertexPosition;

    gl_Position.x = x;
    gl_Position.y = y;
}