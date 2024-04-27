precision highp float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
varying vec2 v_texCoord;

void main() {
    vec4 texColor = texture2D(u_texture, v_texCoord);
    gl_FragColor = vec4(texColor.r, texColor.r, texColor.r, 1.0);
}
