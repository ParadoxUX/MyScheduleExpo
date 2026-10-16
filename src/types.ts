export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export interface Lesson {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  task: string;
  taskDone: boolean;
}

export const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Понедельник' },
  { key: 'tuesday', label: 'Вторник' },
  { key: 'wednesday', label: 'Среда' },
  { key: 'thursday', label: 'Четверг' },
  { key: 'friday', label: 'Пятница' },
  { key: 'saturday', label: 'Суббота' },
];
