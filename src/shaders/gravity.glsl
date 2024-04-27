precision highp float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
varying vec2 v_texCoord;

void main() {
    vec2 above = vec2(v_texCoord.x, v_texCoord.y + 1.0 / u_resolution.y);
    if (above.y >= 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }
    gl_FragColor = texture2D(u_texture, above);
}
