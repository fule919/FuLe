export type Vector3 = [number, number, number];

export enum ShapeType {
  SPHERE = 'SPHERE',
  LIQUID = 'LIQUID',
  STAR = 'STAR'
}

export interface UIState {
  color: string;
  roughness: number;
  metalness: number;
  shape: ShapeType;
}

export const PRESET_COLORS = [
  '#cdff15',
  '#72463e',
  '#978fff',
  '#3e7068',
  '#808993'
];