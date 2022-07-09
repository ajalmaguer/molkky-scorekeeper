import { color } from '@material-tailwind/react/types/components/button';

export function indexToButtonColor(index: number): color {
  const chosenColors: color[] = [
    'pink',
    'purple',
    'indigo',
    'light-blue',
    'teal',
    'light-green',
    'yellow',
    'deep-orange',
  ];

  return chosenColors[index % chosenColors.length];
}

export function indexToTextColor(index: number): string {
  const chosenColors = [
    'text-pink-400',
    'text-purple-400',
    'text-indigo-500',
    'text-light-blue-500',
    'text-teal-500',
    'text-light-green-500',
    'text-yellow-800',
    'text-deep-orange-500',
  ];

  return chosenColors[index % chosenColors.length];
}
