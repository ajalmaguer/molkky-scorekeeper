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

export function indexToBgColor(index: number): string {
  const chosenColors = [
    'bg-pink-400',
    'bg-purple-400',
    'bg-indigo-400',
    'bg-light-blue-400',
    'bg-teal-400',
    'bg-light-green-400',
    'bg-yellow-400',
    'bg-deep-orange-400',
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
