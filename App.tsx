import './global.css';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { store } from './src/store';
import { useAppDispatch, useAppSelector } from './src/store/hooks';
import {
  loadLessons,
  deleteLesson,
  toggleTaskDone,
} from './src/store/lessonsSlice';
import ScheduleScreen from './src/screens/ScheduleScreen';
import { requestNotificationPermission } from './src/notifications';
import { initDatabase } from './src/database';

function AppContent() {
  const dispatch = useAppDispatch();
  const lessons = useAppSelector((s) => s.lessons.items);
  const loaded = useAppSelector((s) => s.lessons.loaded);

  useEffect(() => {
    async function init() {
      try {
        await requestNotificationPermission();
      } catch (e) {
        console.warn('notifications init failed', e);
      }
      dispatch(loadLessons());
    }
    init();
  }, [dispatch]);

  if (!loaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Загрузка…</Text>
      </View>
    );
  }

  return (
    <ScheduleScreen
      lessons={lessons}
      onDelete={(id) => dispatch(deleteLesson(id))}
      onToggleDone={(id) => dispatch(toggleTaskDone(id))}
    />
  );
}

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDatabase()
      .then(() => setDbReady(true))
      .catch((e) => console.error('DB init failed', e));
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        {dbReady ? (
          <AppContent />
        ) : (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
            <Text style={styles.text}>Инициализация БД…</Text>
          </View>
        )}
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { marginTop: 8, color: '#555' },
});
