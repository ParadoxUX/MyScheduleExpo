import * as SQLite from 'expo-sqlite';
import type { Lesson, DayOfWeek } from './types';

let db: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('schedule.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS lessons (
        id TEXT PRIMARY KEY NOT NULL,
        subject TEXT NOT NULL,
        teacher TEXT,
        room TEXT,
        day TEXT NOT NULL,
        startTime TEXT NOT NULL,
        endTime TEXT NOT NULL,
        task TEXT,
        taskDone INTEGER NOT NULL DEFAULT 0
      );
    `);
  }
  return db;
}

export async function initDatabase(): Promise<void> {
  await getDb();
}

export async function getAllLessons(): Promise<Lesson[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<any>('SELECT * FROM lessons');
  return rows.map((row) => ({
    id: row.id,
    subject: row.subject,
    teacher: row.teacher ?? '',
    room: row.room ?? '',
    day: row.day as DayOfWeek,
    startTime: row.startTime,
    endTime: row.endTime,
    task: row.task ?? '',
    taskDone: row.taskDone === 1,
  }));
}

export async function insertLesson(lesson: Lesson): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT INTO lessons (id, subject, teacher, room, day, startTime, endTime, task, taskDone)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      lesson.id,
      lesson.subject,
      lesson.teacher,
      lesson.room,
      lesson.day,
      lesson.startTime,
      lesson.endTime,
      lesson.task,
      lesson.taskDone ? 1 : 0,
    ]
  );
}

export async function updateLesson(lesson: Lesson): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `UPDATE lessons SET subject = ?, teacher = ?, room = ?, day = ?,
      startTime = ?, endTime = ?, task = ?, taskDone = ? WHERE id = ?`,
    [
      lesson.subject,
      lesson.teacher,
      lesson.room,
      lesson.day,
      lesson.startTime,
      lesson.endTime,
      lesson.task,
      lesson.taskDone ? 1 : 0,
      lesson.id,
    ]
  );
}

export async function deleteLesson(id: string): Promise<void> {
  const database = await getDb();
  await database.runAsync('DELETE FROM lessons WHERE id = ?', [id]);
}
