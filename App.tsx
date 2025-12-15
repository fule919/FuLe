import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Stars, ContactShadows } from '@react-three/drei';
import SculptingBlob from './components/SculptingBlob';
import OverlayUI from './components/OverlayUI';
import { ShapeType } from './types';

const App: React.FC = () => {
  const [color, setColor] = useState<string>('#cdff15');
  const [shape, setShape] = useState<ShapeType>(ShapeType.SPHERE);
  const [brushSize, setBrushSize] = useState<number>(0.8);
  const [brushRoundness, setBrushRoundness] = useState<number>(0.5);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey(prev => prev + 1);
  };

  return (
    <div className="flex w-full h-full bg-black overflow-hidden select-none">
      
      {/* 3D Scene - 80% Width */}
      <div className="relative w-[80%] h-full">
        <Canvas
          shadows
          camera={{ position: [0, 0, 6], fov: 45 }}
          gl={{ antialias: true, toneMappingExposure: 1.2 }}
          dpr={[1, 2]} // Handle high DPI screens
        >
          <Suspense fallback={null}>
            <color attach="background" args={['#050505']} />
            
            {/* Environment & Lighting */}
            <Environment preset="studio" />
            
            {/* Futuristic ambient fill */}
            <ambientLight intensity={0.2} color="#444" />
            
            {/* Main directional lights for gloss hits */}
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={2} 
              color="#ffffff" 
              castShadow 
            />
            <pointLight position={[-10, -10, -5]} intensity={5} color={color} distance={20} />
            
            {/* Background Stars for depth */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* The Interactive Blob */}
            {/* Key forces re-mount on reset */}
            <group key={resetKey}>
               <SculptingBlob 
                 color={color} 
                 shapeType={shape} 
                 brushSize={brushSize}
                 brushRoundness={brushRoundness}
               />
            </group>

            {/* Ground Reflection/Shadow */}
            <ContactShadows 
              position={[0, -2.5, 0]} 
              opacity={0.5} 
              scale={10} 
              blur={2.5} 
              far={4.5} 
              color={color} 
            />

            {/* Controls - limit zoom to keep UI usable */}
            <OrbitControls 
              minDistance={4} 
              maxDistance={12} 
              enablePan={false}
            />
            
          </Suspense>
        </Canvas>
      </div>

      {/* UI Sidebar - 20% Width */}
      <div className="w-[20%] h-full border-l border-white/10 bg-black z-10 relative flex flex-col">
        <OverlayUI 
          currentColor={color}
          onColorChange={setColor}
          currentShape={shape}
          onShapeChange={(s) => { setShape(s); handleReset(); }}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          brushRoundness={brushRoundness}
          onBrushRoundnessChange={setBrushRoundness}
          onReset={handleReset}
        />
      </div>

    </div>
  );
};

export default App;