precision highp float;
uniform sampler2D u_texture;
varying vec2 v_texCoord;

// Function to shift hue
vec3 shiftHue(vec3 color, float hueShift) {
    float angle = hueShift * 3.14159;
    float s = sin(angle);
    float c = cos(angle);
    vec3 rotatedColor = vec3(
        color.x * c - color.y * s,
        color.x * s + color.y * c,
        color.z
    );
    return rotatedColor;
}

void main() {
    vec4 texColor = texture2D(u_texture, v_texCoord);
    vec3 shiftedColor = shiftHue(texColor.rgb, 0.3); // Adjust hue shift here
    gl_FragColor = vec4(shiftedColor, texColor.a);
}
