'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

/**
 * MeshGradient — fond « soie fluide » WebGL (esthétique mesh gradient Stripe-style)
 *
 * Un fragment shader sur mesure : nappes de couleur qui ondulent comme de la
 * soie, pilotées par :
 *  - le SCROLL  → narration en 5 actes (palette + intensité par section du funnel)
 *  - la SOURIS  → déformation locale avec inertie (desktop uniquement)
 *
 * Performance :
 *  - rendu interne à résolution réduite (les dégradés tolèrent très bien
 *    l'upscale CSS) → coût GPU minimal, même sur mobile
 *  - boucle en pause quand l'onglet est masqué
 *  - prefers-reduced-motion → une seule frame statique, pas de boucle
 *  - WebGL indisponible → fallback CSS statique (toujours rendu derrière)
 */

// ─── Shaders ──────────────────────────────────────────────────────────────────

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;      // position lissée, espace aspect-corrigé
uniform float uMouseForce; // 0 sur tactile, 1 sur desktop
uniform float uIntensity;  // amplitude générale (acte courant)
uniform vec3  uBg;
uniform vec3  uC0;
uniform vec3  uC1;
uniform vec3  uC2;
uniform vec3  uC3;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = uTime * 0.13;

  // ── Ondulations « soie » (signature mesh gradient) ──
  p.y += 0.085 * sin(p.x * 1.9 + t * 1.35) * uIntensity;
  p.x += 0.060 * sin(p.y * 2.8 - t * 0.95) * uIntensity;
  p.y += 0.034 * sin(p.x * 4.7 - t * 2.1) * uIntensity;

  // ── Déformation souris (inertie appliquée côté JS) ──
  vec2 dm = p - uMouse;
  float md = length(dm) + 1e-4;
  p += (dm / md) * 0.07 * exp(-md * 2.6) * uMouseForce;

  // ── Centres de couleur en dérive lente (Lissajous) ──
  vec2 c0 = vec2((0.28 + 0.24 * sin(t * 0.70)) * aspect, 0.72 + 0.20 * cos(t * 0.60));
  vec2 c1 = vec2((0.78 + 0.20 * cos(t * 0.50 + 2.0)) * aspect, 0.38 + 0.26 * sin(t * 0.80 + 1.0));
  vec2 c2 = vec2((0.52 + 0.30 * sin(t * 0.42 + 4.2)) * aspect, 0.14 + 0.20 * cos(t * 0.90 + 3.1));
  vec2 c3 = vec2((0.14 + 0.20 * cos(t * 0.62 + 1.4)) * aspect, 0.30 + 0.30 * sin(t * 0.52 + 5.3));

  float w0 = exp(-2.5 * distance(p, c0));
  float w1 = exp(-2.5 * distance(p, c1));
  float w2 = exp(-2.5 * distance(p, c2));
  float w3 = exp(-2.5 * distance(p, c3));
  float ws = w0 + w1 + w2 + w3 + 1e-4;

  vec3 mesh = (uC0 * w0 + uC1 * w1 + uC2 * w2 + uC3 * w3) / ws;

  // Fusion vers le fond : les couleurs restent profondes (lisibilité du texte)
  float lum = clamp(ws * 0.85, 0.0, 1.0);
  vec3 col = mix(uBg, mesh, smoothstep(0.06, 0.95, lum) * 0.62 * uIntensity);

  // Vignette douce
  float vig = smoothstep(1.30, 0.40, distance(uv, vec2(0.5)));
  col *= mix(0.82, 1.0, vig);

  // Grain film intégré
  col += (hash(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5) * 0.032;

  gl_FragColor = vec4(col, 1.0);
}
`;

// ─── Narration : palettes par acte du funnel ─────────────────────────────────

type Vec3 = [number, number, number];
const rgb = (hex: number): Vec3 => [
  ((hex >> 16) & 255) / 255,
  ((hex >> 8) & 255) / 255,
  (hex & 255) / 255,
];

const BG: Vec3 = rgb(0x070815);

interface Act {
  at: number;          // position de scroll 0..1
  colors: [Vec3, Vec3, Vec3, Vec3];
  intensity: number;
}

const ACTS: Act[] = [
  // 1. Hero — indigo dominant, ample
  { at: 0.0, colors: [rgb(0x4f46e5), rgb(0x7c3aed), rgb(0x1e1b4b), rgb(0x2563eb)], intensity: 1.0 },
  // 2. Problème — plus sombre, violet profond
  { at: 0.2, colors: [rgb(0x4338ca), rgb(0x6d28d9), rgb(0x1e1b4b), rgb(0x312e81)], intensity: 0.8 },
  // 3. Mosaïque — accalmie, les images sont les stars
  { at: 0.42, colors: [rgb(0x312e81), rgb(0x3730a3), rgb(0x1e1b4b), rgb(0x1e1b4b)], intensity: 0.42 },
  // 4. Packs — remontée chaleureuse au moment décisif
  { at: 0.66, colors: [rgb(0x6366f1), rgb(0x8b5cf6), rgb(0x4f46e5), rgb(0x7c3aed)], intensity: 1.0 },
  // 5. CTA finale — le cyan se lève
  { at: 0.92, colors: [rgb(0x6366f1), rgb(0x22d3ee), rgb(0x8b5cf6), rgb(0x06b6d4)], intensity: 1.0 },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [
  lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t),
];

/** Interpole palette + intensité entre les actes selon la progression. */
function sampleActs(s: number): { colors: [Vec3, Vec3, Vec3, Vec3]; intensity: number } {
  let i = 0;
  while (i < ACTS.length - 1 && s > ACTS[i + 1].at) i++;
  const a = ACTS[i];
  const b = ACTS[Math.min(i + 1, ACTS.length - 1)];
  const span = Math.max(b.at - a.at, 1e-4);
  const raw = Math.min(Math.max((s - a.at) / span, 0), 1);
  const t = raw * raw * (3 - 2 * raw); // smoothstep
  return {
    colors: [
      lerp3(a.colors[0], b.colors[0], t),
      lerp3(a.colors[1], b.colors[1], t),
      lerp3(a.colors[2], b.colors[2], t),
      lerp3(a.colors[3], b.colors[3], t),
    ],
    intensity: lerp(a.intensity, b.intensity, t),
  };
}

// ─── Setup WebGL ──────────────────────────────────────────────────────────────

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

// ─── Composant ────────────────────────────────────────────────────────────────

export function MeshGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  // Fil de progression (desktop)
  const { scrollYProgress } = useScroll();
  const threadScale = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext('webgl', { antialias: false, depth: false, stencil: false, alpha: false }) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return; // fallback CSS visible derrière

    // ── Programme ──
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // Triangle plein écran
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const U = {
      res: gl.getUniformLocation(prog, 'uRes'),
      time: gl.getUniformLocation(prog, 'uTime'),
      mouse: gl.getUniformLocation(prog, 'uMouse'),
      mouseForce: gl.getUniformLocation(prog, 'uMouseForce'),
      intensity: gl.getUniformLocation(prog, 'uIntensity'),
      bg: gl.getUniformLocation(prog, 'uBg'),
      c0: gl.getUniformLocation(prog, 'uC0'),
      c1: gl.getUniformLocation(prog, 'uC1'),
      c2: gl.getUniformLocation(prog, 'uC2'),
      c3: gl.getUniformLocation(prog, 'uC3'),
    };
    gl.uniform3fv(U.bg, BG);

    // ── Résolution interne réduite (les dégradés tolèrent l'upscale) ──
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const renderScale = isCoarse ? 0.45 : 0.6;

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * renderScale));
      const h = Math.max(1, Math.round(canvas.clientHeight * renderScale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(U.res, w, h);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // ── État animé (lissé en JS, pas de jank) ──
    let rafId = 0;
    let running = true;
    const start = performance.now();

    let scrollSmooth = 0;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const mouseForce = isCoarse ? 0 : 1;

    const onMouseMove = (e: MouseEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight; // origine WebGL en bas
    };
    if (!isCoarse) window.addEventListener('mousemove', onMouseMove, { passive: true });

    const frame = (now: number) => {
      if (!running) return;

      // Scroll lissé
      const doc = document.documentElement;
      const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const target = Math.min(Math.max(window.scrollY / max, 0), 1);
      scrollSmooth += (target - scrollSmooth) * 0.05;

      // Souris avec inertie
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;

      const { colors, intensity } = sampleActs(scrollSmooth);
      const aspect = canvas.width / canvas.height;

      gl.uniform1f(U.time, (now - start) / 1000);
      gl.uniform2f(U.mouse, mouse.x * aspect, mouse.y);
      gl.uniform1f(U.mouseForce, mouseForce);
      gl.uniform1f(U.intensity, intensity);
      gl.uniform3fv(U.c0, colors[0]);
      gl.uniform3fv(U.c1, colors[1]);
      gl.uniform3fv(U.c2, colors[2]);
      gl.uniform3fv(U.c3, colors[3]);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      rafId = requestAnimationFrame(frame);
    };

    if (reduce) {
      // Une seule frame statique — pas de boucle d'animation
      const { colors, intensity } = sampleActs(0);
      gl.uniform1f(U.time, 12);
      gl.uniform2f(U.mouse, 0.5 * (canvas.width / canvas.height), 0.5);
      gl.uniform1f(U.mouseForce, 0);
      gl.uniform1f(U.intensity, intensity);
      gl.uniform3fv(U.c0, colors[0]);
      gl.uniform3fv(U.c1, colors[1]);
      gl.uniform3fv(U.c2, colors[2]);
      gl.uniform3fv(U.c3, colors[3]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      rafId = requestAnimationFrame(frame);
    }

    // Pause hors onglet
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!reduce && !running) {
        running = true;
        rafId = requestAnimationFrame(frame);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [reduce]);

  return (
    <>
      <div className="fixed left-0 top-0 -z-50 h-screen w-full overflow-hidden" aria-hidden="true">
        {/* Fallback CSS — visible si WebGL absent, recouvert sinon */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 30% 10%, rgba(99,102,241,0.25) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(139,92,246,0.18) 0%, transparent 55%), #070815',
          }}
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>

      {/* Fil de progression — desktop uniquement */}
      <div
        className="hidden lg:block fixed right-6 top-1/2 -translate-y-1/2 h-[32vh] w-px bg-white/[0.08] z-40 pointer-events-none rounded-full overflow-hidden"
        aria-hidden="true"
      >
        <motion.div
          className="w-full h-full origin-top bg-gradient-to-b from-indigo-400 via-violet-400 to-cyan-400"
          style={{ scaleY: threadScale }}
        />
      </div>
    </>
  );
}
