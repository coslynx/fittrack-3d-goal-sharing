/**
 * Represents the fitness color palette based on Tailwind configuration.
 */
export type FitnessColors = {
  primary: string;
  secondary: string;
  accent: string;
  'text-primary': string;
  'text-secondary': string;
  background: string;
};

/**
 * Represents the spacing values used in the application, based on Tailwind configuration.
 */
export type Spacing =
  | '0.25rem'
  | '0.5rem'
  | '0.75rem'
  | '1rem'
  | '1.25rem'
  | '1.5rem'
  | '2rem'
  | '2.5rem'
  | '3rem'
  | '4rem'
  | '5rem'
  | '6rem';

/**
 * Represents the font family used in the application.
 */
export type FontFamily = 'Montserrat' | 'Open Sans';

/**
 * Represents the screen sizes used for responsive design.
 */
export type ScreenSize = '320px' | '640px' | '768px' | '1024px' | '1280px' | '1536px';

/**
 * Represents the data structure for a 3D model.
 */
export interface ThreeDModel {
  modelPath: string;
  scale?: number;
  rotation?: [number, number, number];
}

/**
 * Represents a single data point for the fitness graph.
 */
export interface GraphDataPoint {
  date: string; // ISO date format
  value: number;
  label: string;
}

/**
 * Represents a generic event handler function.
 */
export type EventHandler = (event: any) => void;

/**
 * Represents Tailwind CSS class names for styling.
 */
export type TailwindClassNames = string;