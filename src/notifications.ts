import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('lessons', {
      name: 'Напоминания о занятиях',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  return finalStatus === 'granted';
}

export async function scheduleLessonReminder(
  subject: string,
  dayOfWeek: number,
  time: string
): Promise<void> {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const triggerDate = new Date();
  triggerDate.setHours(hours, minutes - 15, 0, 0);

  const currentDay = now.getDay() === 0 ? 7 : now.getDay();
  let daysAhead = dayOfWeek - currentDay;
  if (daysAhead < 0 || (daysAhead === 0 && triggerDate <= now)) {
    daysAhead += 7;
  }
  triggerDate.setDate(triggerDate.getDate() + daysAhead);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Скоро занятие',
      body: `${subject} начнётся через 15 минут`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId: 'lessons',
    },
  });
}
