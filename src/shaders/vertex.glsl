#version 300 es

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec3 inColor;

out vec3 color;

uniform mat4 Projection;
uniform mat4 View;

void main() {
    color = inColor;
    gl_Position = Projection * View * vec4(inPosition.xyz, 1.0);
}