#version 300 es

precision mediump float;

layout (location = 0) out vec4 frag_color;

in vec3 color;

void main() {
    frag_color = vec4(color, 1.0);
}