'use client';

import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';

const ImageShaderMaterial = {
  uniforms: {
    uTexture: { value: null },
    uProgress: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform float uProgress;
    varying vec2 vUv;

    void main() {
      // Cinematic vertical wipe
      float wipe = step(1.0 - uProgress, vUv.y);
      
      // Edge distortion
      float distortion = sin(vUv.x * 12.0 + uProgress * 4.0) * 0.015 * (1.0 - uProgress);
      vec2 distortedUv = vec2(vUv.x, vUv.y + distortion);
      
      vec4 color = texture2D(uTexture, distortedUv);
      gl_FragColor = vec4(color.rgb, wipe * color.a);
    }
  `
};

export function WebGLItem({ url, progressObj }) {
  const mesh = useRef();
  // Ensure we get the string path if passing a Next.js static import
  const texture = useLoader(THREE.TextureLoader, typeof url === 'string' ? url : url.src);

  useFrame(() => {
    if (mesh.current) {
      // We pull the 'value' from the GSAP-animated object
      mesh.current.material.uniforms.uProgress.value = progressObj.value;
    }
  });

  return (
    <mesh ref={mesh} scale={[4, 6, 1]}> 
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        transparent
        args={[ImageShaderMaterial]}
        uniforms-uTexture-value={texture}
      />
    </mesh>
  );
}