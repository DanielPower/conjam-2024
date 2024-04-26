precision highp float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
varying vec2 v_texCoord;

int countNeighbors() {
    int neighbors = 0;
    if (texture2D(u_texture, v_texCoord + vec2(-1.0 / u_resolution.x, -1.0 / u_resolution.y)).r == 1.0) neighbors++;
    if (texture2D(u_texture, v_texCoord + vec2(-1.0 / u_resolution.x, 0.0 / u_resolution.y)).r == 1.0) neighbors++;
    if (texture2D(u_texture, v_texCoord + vec2(-1.0 / u_resolution.x, 1.0 / u_resolution.y)).r == 1.0) neighbors++;
    if (texture2D(u_texture, v_texCoord + vec2(0.0 / u_resolution.x, -1.0 / u_resolution.y)).r == 1.0) neighbors++;
    if (texture2D(u_texture, v_texCoord + vec2(0.0 / u_resolution.x, 1.0 / u_resolution.y)).r == 1.0) neighbors++;
    if (texture2D(u_texture, v_texCoord + vec2(1.0 / u_resolution.x, -1.0 / u_resolution.y)).r == 1.0) neighbors++;
    if (texture2D(u_texture, v_texCoord + vec2(1.0 / u_resolution.x, 0.0 / u_resolution.y)).r == 1.0) neighbors++;
    if (texture2D(u_texture, v_texCoord + vec2(1.0 / u_resolution.x, 1.0 / u_resolution.y)).r == 1.0) neighbors++;
    return neighbors;
}

void main() {
    vec4 texColor = texture2D(u_texture, v_texCoord);
    int neighbors = countNeighbors();
    if (texColor.r == 1.0) {
        if (neighbors < 2) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
        }
        if (neighbors > 3) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
        }
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        return;
    }
    if (neighbors == 3) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        return;
    }
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}