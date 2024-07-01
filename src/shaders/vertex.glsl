#version 300 es

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec3 inColor;

out vec3 color;

void main() {
    color = inColor;
    gl_Position = vec4(inPosition.xyz, 1.0);
}