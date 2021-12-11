precision highp float;

uniform sampler2D sprite;
uniform vec4 color;

varying vec2 texcoord;

void main() {
    vec4 col = texture2D(sprite, texcoord);
    gl_FragColor = vec4(col.g, col.g, col.g, 1.0-col.r) * color;
}