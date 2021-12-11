precision highp float;

uniform sampler2D sprite;
uniform vec4 color;
varying vec2 texcoord;

void main() {
    gl_FragColor = texture2D(sprite, texcoord) * color;
}