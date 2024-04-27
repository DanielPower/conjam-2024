precision highp float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
varying vec2 v_texCoord;

void main() {
    vec2 above = v_texCoord + vec2(0.0, 1.0 / u_resolution.y);
    vec2 below = v_texCoord + vec2(0.0, -1.0 / u_resolution.y);

    vec4 selfColor = texture2D(u_texture, v_texCoord);
    vec4 aboveColor = above.y >= 1.0 ? vec4(0.0, 0.0, 0.0, 1.0) : texture2D(u_texture, above);
    vec4 belowColor = texture2D(u_texture, below);

    bool selfEmpty = selfColor.r == 0.0;
    bool aboveEmpty = aboveColor.r == 0.0;

    bool belowEmpty = false;
    for (float i = 0.0; i<100000000.0; i += 1.0) {
        vec2 coord = v_texCoord + vec2(0.0, -i / u_resolution.y);
        if (coord.y < 0.0) {
            break;
        }
        vec4 color = texture2D(u_texture, coord);
        if (color.r == 0.0) {
            belowEmpty = true;
            break;
        }
    }

    if (selfEmpty) {
        if (!aboveEmpty) {
            gl_FragColor = aboveColor;
            return;
        }
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }
    if (belowEmpty) {
        gl_FragColor = aboveColor;
        return;
    }
    gl_FragColor = selfColor;
}
