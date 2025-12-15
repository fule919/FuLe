import React, { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { ShapeType } from '../types';

interface SculptingBlobProps {
  color: string;
  shapeType: ShapeType;
  brushSize: number;
  brushRoundness: number;
}

const SculptingBlob: React.FC<SculptingBlobProps> = ({ 
  color, 
  shapeType, 
  brushSize,
  brushRoundness
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Geometry parameters
  const detail = 64; // Resolution of the sphere
  const radius = 1.5; // Decreased size

  // Store original positions for shape resetting logic
  const originalPositions = useRef<Float32Array | null>(null);

  // Initialize geometry and store original positions
  useEffect(() => {
    if (meshRef.current) {
      const geometry = meshRef.current.geometry;
      if (!originalPositions.current) {
        originalPositions.current = geometry.attributes.position.array.slice() as Float32Array;
      }
    }
  }, []);

  // Handle Shape Changes (Morphing)
  useEffect(() => {
    if (!meshRef.current || !originalPositions.current) return;

    const geometry = meshRef.current.geometry;
    const positionAttribute = geometry.attributes.position;
    const positions = positionAttribute.array;
    const originals = originalPositions.current;
    
    // Reset to base sphere first for consistent calculation
    for (let i = 0; i < positions.length; i++) {
        positions[i] = originals[i];
    }

    const vector = new THREE.Vector3();
    const count = positionAttribute.count;

    for (let i = 0; i < count; i++) {
      vector.set(originals[i * 3], originals[i * 3 + 1], originals[i * 3 + 2]);
      
      // Apply shape logic
      if (shapeType === ShapeType.LIQUID) {
        // Organic random noise distortion
        const noise = Math.sin(vector.x * 2.0) * Math.sin(vector.y * 2.0) * Math.sin(vector.z * 2.0);
        const scale = 1 + noise * 0.3;
        vector.multiplyScalar(scale);
      } else if (shapeType === ShapeType.STAR) {
        // Pinching axes
        const dist = Math.sqrt(vector.x ** 2 + vector.y ** 2);
        const zFactor = Math.cos(dist * 2);
        vector.z += zFactor * 0.5;
        vector.multiplyScalar(0.8 + Math.abs(vector.x) * 0.2);
      }
      // SPHERE does nothing (keeps original)

      positions[i * 3] = vector.x;
      positions[i * 3 + 1] = vector.y;
      positions[i * 3 + 2] = vector.z;
    }

    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
  }, [shapeType]);


  // Interaction Logic: Sculpting
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!active || !meshRef.current) return;
    
    const { point, face } = e;
    if (!face) return;

    const geometry = meshRef.current.geometry;
    const positionAttribute = geometry.attributes.position;
    const normalAttribute = geometry.attributes.normal;
    
    const vertex = new THREE.Vector3();
    const worldPoint = point.clone();
    
    // Transform point to local space for calculation
    meshRef.current.worldToLocal(worldPoint);

    // Sculpting Parameters
    // Map roundness (0 to 1) to exponent (High/Sharp to Low/Round)
    // 0 Roundness (Sharp) -> Exponent ~4
    // 1 Roundness (Round) -> Exponent ~0.5
    // Typical Gaussian is ~2.
    const falloffExponent = 4 - (brushRoundness * 3.5); 
    const strength = 0.15; // How much it pulls out per frame

    // Loop through vertices
    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(positionAttribute, i);
      
      const distance = vertex.distanceTo(worldPoint);
      
      if (distance < brushSize) {
        // Falloff function
        // (1 - d/r)^k
        const normalizedDist = distance / brushSize;
        const falloff = Math.pow(Math.max(0, 1 - normalizedDist), falloffExponent);
        
        // Direction: Push outward along the vertex normal
        const normal = new THREE.Vector3().fromBufferAttribute(normalAttribute, i);
        
        // Displace
        vertex.addScaledVector(normal, strength * falloff);
        
        // Update buffer
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
    }

    positionAttribute.needsUpdate = true;
    // Recomputing normals to maintain lighting quality
    geometry.computeVertexNormals();
  };

  // Gentle rotation
  useFrame((state, delta) => {
    if (meshRef.current && !active) {
       meshRef.current.rotation.y += delta * 0.1;
       meshRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <Sphere
      args={[radius, detail, detail]}
      ref={meshRef}
      onPointerOver={() => { setHover(true); document.body.style.cursor = 'crosshair'; }}
      onPointerOut={() => { setHover(false); setActive(false); document.body.style.cursor = 'default'; }}
      onPointerDown={(e) => { 
        e.stopPropagation(); 
        setActive(true); 
        // Capture pointer so dragging outside the mesh still works somewhat (if implemented globally)
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      }}
      onPointerUp={(e) => { 
        setActive(false);
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      }}
      onPointerMove={handlePointerMove}
    >
      {/* High Gloss Material mimicking the reference images */}
      <meshPhysicalMaterial
        color={color}
        roughness={0.15}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        transmission={0} // Opaque like plastic
        reflectivity={1}
        iridescence={0.3}
        iridescenceIOR={1.4}
      />
    </Sphere>
  );
};

export default SculptingBlob;