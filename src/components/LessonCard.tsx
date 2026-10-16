import { View, Text, Pressable } from 'react-native';
import type { Lesson } from '../types';

interface Props {
  lesson: Lesson;
  onDelete: (id: string) => void;
  onToggleDone: (id: string) => void;
  onEdit: (lesson: Lesson) => void;
}

export default function LessonCard({ lesson, onDelete, onToggleDone, onEdit }: Props) {
  return (
    <View className="bg-white rounded-xl p-3 mb-2 border border-gray-100">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900">{lesson.subject}</Text>
          <Text className="text-xs text-gray-500 mt-1">
            {lesson.startTime}–{lesson.endTime}
            {lesson.room ? ` · ауд. ${lesson.room}` : ''}
          </Text>
          {!!lesson.teacher && (
            <Text className="text-xs text-gray-500">{lesson.teacher}</Text>
          )}
          {!!lesson.task && (
            <Text
              className={`text-xs mt-1 ${
                lesson.taskDone ? 'text-gray-400 line-through' : 'text-gray-700'
              }`}
            >
              Задание: {lesson.task}
            </Text>
          )}
        </View>

        <Pressable
          onPress={() => onToggleDone(lesson.id)}
          className={`w-6 h-6 rounded-full border items-center justify-center ${
            lesson.taskDone ? 'bg-green-500 border-green-500' : 'border-gray-300'
          }`}
        >
          {lesson.taskDone && <Text className="text-white text-xs">✓</Text>}
        </Pressable>
      </View>

      <View className="flex-row mt-2 self-end gap-3">
        <Pressable onPress={() => onEdit(lesson)}>
          <Text className="text-xs text-blue-600 font-medium">Изменить</Text>
        </Pressable>
        <Pressable onPress={() => onDelete(lesson.id)}>
          <Text className="text-xs text-red-500 font-medium">Удалить</Text>
        </Pressable>
      </View>
    </View>
  );
}
