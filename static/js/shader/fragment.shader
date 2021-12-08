precision highp float;

uniform sampler2D sprite;
varying vec2 texcoord;

void main() {
    gl_FragColor = texture2D(sprite, texcoord);
}