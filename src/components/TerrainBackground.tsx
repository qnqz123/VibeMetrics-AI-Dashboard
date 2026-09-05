import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const TerrainBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use window.THREE (from CDN as requested) or imported THREE
    const ThreeLib = (window as any).THREE || THREE;

    // Scene setup
    const scene = new ThreeLib.Scene();
    scene.fog = new ThreeLib.FogExp2(0x020617, 0.015);

    // Camera setup
    const camera = new ThreeLib.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 18, 38);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new ThreeLib.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = ThreeLib.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lighting setup - Neon Cyan & Purple
    const ambientLight = new ThreeLib.AmbientLight(0x071126, 1.2);
    scene.add(ambientLight);

    const cyanLight = new ThreeLib.PointLight(0x06b6d4, 3.5, 90);
    cyanLight.position.set(-25, 22, 10);
    scene.add(cyanLight);

    const purpleLight = new ThreeLib.PointLight(0xa855f7, 4.0, 90);
    purpleLight.position.set(25, 18, -5);
    scene.add(purpleLight);

    const blueDirLight = new ThreeLib.DirectionalLight(0x38bdf8, 1.0);
    blueDirLight.position.set(0, 35, 20);
    scene.add(blueDirLight);

    // Low-poly terrain geometry
    const planeWidth = 110;
    const planeHeight = 110;
    const segmentsX = 40;
    const segmentsY = 40;

    const geometry = new ThreeLib.PlaneGeometry(planeWidth, planeHeight, segmentsX, segmentsY);
    geometry.rotateX(-Math.PI / 2.3);

    // Store original vertex coordinates for organic wave displacement
    const posAttribute = geometry.attributes.position;
    const originalPositions = new Float32Array(posAttribute.count * 3);
    for (let i = 0; i < posAttribute.count * 3; i++) {
      originalPositions[i] = posAttribute.array[i];
    }

    // Material with flat shading for trendy low-poly faceted look
    const material = new ThreeLib.MeshStandardMaterial({
      color: 0x090f1d,
      roughness: 0.55,
      metalness: 0.75,
      flatShading: true,
    });

    const terrainMesh = new ThreeLib.Mesh(geometry, material);
    terrainMesh.position.y = -6;
    scene.add(terrainMesh);

    // Neon Wireframe Overlay
    const wireframeMaterial = new ThreeLib.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const wireframeMesh = new ThreeLib.Mesh(geometry, wireframeMaterial);
    wireframeMesh.position.y = -5.92;
    scene.add(wireframeMesh);

    // Floating Ambient Digital Nodes / Dust Particles
    const particleCount = 180;
    const particleGeo = new ThreeLib.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const color1 = new ThreeLib.Color(0x06b6d4); // cyan
    const color2 = new ThreeLib.Color(0xa855f7); // purple

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 90;
      particlePositions[i * 3 + 1] = Math.random() * 30 - 2;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 90;

      const chosenColor = Math.random() > 0.5 ? color1 : color2;
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new ThreeLib.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new ThreeLib.BufferAttribute(particleColors, 3));

    const particleMat = new ThreeLib.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: ThreeLib.AdditiveBlending,
    });

    const particles = new ThreeLib.Points(particleGeo, particleMat);
    scene.add(particles);

    // Interactive mouse movement physics
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalized device coordinates (-1 to +1)
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle responsive resize
    const handleResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new ThreeLib.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow interpolation (lerp)
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      // Gently tilt terrain and camera
      camera.position.x = currentMouseX * 12;
      camera.position.y = 18 + currentMouseY * 5;
      camera.lookAt(currentMouseX * 4, -2, -8);

      // Light rotation & pulsation
      cyanLight.position.x = Math.sin(elapsedTime * 0.4) * 35 - 10;
      cyanLight.position.z = Math.cos(elapsedTime * 0.3) * 25;

      purpleLight.position.x = Math.cos(elapsedTime * 0.35) * 35 + 10;
      purpleLight.position.z = Math.sin(elapsedTime * 0.45) * 25;

      // Gently wave vertices of the low-poly terrain
      const positions = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < posAttribute.count; i++) {
        const u = originalPositions[i * 3];
        const v = originalPositions[i * 3 + 1];
        const w = originalPositions[i * 3 + 2];

        // Complex organic harmonic displacement
        const wave1 = Math.sin(u * 0.12 + elapsedTime * 0.85) * 2.2;
        const wave2 = Math.cos(w * 0.14 + elapsedTime * 0.65) * 2.0;
        const wave3 = Math.sin((u + w) * 0.08 + elapsedTime * 0.4) * 1.5;

        // Apply height displacement along Y (mesh local coordinates)
        positions[i * 3 + 1] = v + wave1 + wave2 + wave3;
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();

      // Slowly rotate particle field
      particles.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      wireframeMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="vibemetrics-3d-canvas-container"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
};
