precision highp float;
uniform sampler2D u_texture; 
varying vec2 v_texCoord;

const float width = 100.0;
const float height = 100.0;

int countNeighbors() {
    int neighbors = 0;
    if (texture2D(u_texture, v_texCoord + vec2(-1.0 / width, -1.0 / height)).r == 1.0) neighbors++;
    if (texture2D(u_texture, v_texCoord + vec2(-1.0 / width, 0.0 / height)).r == 1.0) neighbors++;
    if (texture2D(u_texture, v_texCoord + vec2(-1.0 / width, 1.0 / height)).r == 1.0) neighbors++;
    if (texture2D(u_texture, v_texCoord + vec2(0.0 / width, -1.0 / height)).r == 1.0) neighbors++;
    if (texture2D(u_texture, v_texCoord + vec2(0.0 / width, 1.0 / height)).r == 1.0) neighbors++;
    if (texture2D(u_texture, v_texCoord + vec2(1.0 / width, -1.0 / height)).r == 1.0) neighbors++;
    if (texture2D(u_texture, v_texCoord + vec2(1.0 / width, 0.0 / height)).r == 1.0) neighbors++;
    if (texture2D(u_texture, v_texCoord + vec2(1.0 / width, 1.0 / height)).r == 1.0) neighbors++;
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