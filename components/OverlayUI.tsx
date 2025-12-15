import React from 'react';
import { Layers, RotateCcw, Box, Hexagon, Circle, Sliders } from 'lucide-react';
import { ShapeType, PRESET_COLORS } from '../types';

interface OverlayUIProps {
  currentColor: string;
  onColorChange: (c: string) => void;
  currentShape: ShapeType;
  onShapeChange: (s: ShapeType) => void;
  brushSize: number;
  onBrushSizeChange: (v: number) => void;
  brushRoundness: number;
  onBrushRoundnessChange: (v: number) => void;
  onReset: () => void;
}

const OverlayUI: React.FC<OverlayUIProps> = ({ 
  currentColor, 
  onColorChange, 
  currentShape, 
  onShapeChange,
  brushSize,
  onBrushSizeChange,
  brushRoundness,
  onBrushRoundnessChange,
  onReset
}) => {
  return (
    <div className="w-full h-full flex flex-col gap-6 p-4 overflow-y-auto text-white">
      
      {/* Compact Header */}
      <header className="flex flex-col gap-2 border-b border-white/10 pb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-display font-bold tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            LE_01
          </h1>
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
        </div>
        <p className="text-gray-500 font-sans text-[10px] tracking-wider uppercase">
          Matter Sculptor v1.0
        </p>
      </header>

      {/* Shapes */}
      <div className="space-y-3">
        <div className="text-[10px] text-gray-400 font-display uppercase tracking-widest flex items-center gap-2">
          <Layers size={12} /> Base Topology
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => onShapeChange(ShapeType.SPHERE)}
            className={`group flex flex-col items-center gap-1.5 p-2 rounded-sm transition-all duration-300 ${currentShape === ShapeType.SPHERE ? 'bg-white/10 ring-1 ring-white/50' : 'hover:bg-white/5'}`}
          >
            <Circle size={16} className={currentShape === ShapeType.SPHERE ? 'text-white' : 'text-gray-500'} />
            <span className="text-[8px] text-gray-400 font-mono uppercase">Sphere</span>
          </button>
          
          <button 
            onClick={() => onShapeChange(ShapeType.LIQUID)}
            className={`group flex flex-col items-center gap-1.5 p-2 rounded-sm transition-all duration-300 ${currentShape === ShapeType.LIQUID ? 'bg-white/10 ring-1 ring-white/50' : 'hover:bg-white/5'}`}
          >
            <Hexagon size={16} className={currentShape === ShapeType.LIQUID ? 'text-white' : 'text-gray-500'} />
            <span className="text-[8px] text-gray-400 font-mono uppercase">Liquid</span>
          </button>

          <button 
            onClick={() => onShapeChange(ShapeType.STAR)}
            className={`group flex flex-col items-center gap-1.5 p-2 rounded-sm transition-all duration-300 ${currentShape === ShapeType.STAR ? 'bg-white/10 ring-1 ring-white/50' : 'hover:bg-white/5'}`}
          >
            <Box size={16} className={currentShape === ShapeType.STAR ? 'text-white' : 'text-gray-500'} />
            <span className="text-[8px] text-gray-400 font-mono uppercase">Artifact</span>
          </button>
        </div>
      </div>

      {/* Tool Calibration */}
      <div className="space-y-4">
         <div className="text-[10px] text-gray-400 font-display uppercase tracking-widest flex items-center gap-2">
           <Sliders size={12} /> Calibration
         </div>
         
         <div className="space-y-3 px-1">
            {/* Size Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono text-gray-500 uppercase">
                <span>Flux Radius</span>
                <span className="text-white">{(brushSize).toFixed(1)}</span>
              </div>
              <input 
                type="range" 
                min="0.2" 
                max="2.0" 
                step="0.1"
                value={brushSize}
                onChange={(e) => onBrushSizeChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-900 rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-none hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
              />
            </div>

            {/* Roundness Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono text-gray-500 uppercase">
                <span>Roundness</span>
                <span className="text-white">{(brushRoundness * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.05"
                value={brushRoundness}
                onChange={(e) => onBrushRoundnessChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-900 rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-none hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
              />
            </div>
         </div>
      </div>

      {/* Materials */}
      <div className="space-y-3">
         <div className="text-[10px] text-gray-400 font-display uppercase tracking-widest">
           Chromatophore
         </div>
         <div className="grid grid-cols-5 gap-2">
           {PRESET_COLORS.map((color) => (
             <button
               key={color}
               onClick={() => onColorChange(color)}
               className={`w-full aspect-square rounded-full border border-white/10 transition-transform hover:scale-110 ${currentColor === color ? 'ring-2 ring-white scale-110' : ''}`}
               style={{ backgroundColor: color }}
               aria-label={`Select color ${color}`}
             />
           ))}
         </div>
      </div>

      <div className="flex-grow" />

      {/* Footer / Reset */}
      <div className="border-t border-white/10 pt-4">
        <button 
          onClick={onReset}
          className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-sm p-2 flex items-center justify-center gap-2 transition-all font-mono text-[10px] tracking-wider uppercase group"
        >
          <RotateCcw size={12} className="group-hover:-rotate-180 transition-transform duration-500" /> 
          Reset Matter
        </button>
      </div>

    </div>
  );
};

export default OverlayUI;