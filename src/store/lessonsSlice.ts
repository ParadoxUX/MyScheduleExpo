import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Lesson } from '../types';
import * as db from '../database';

interface LessonsState {
  items: Lesson[];
  loaded: boolean;
}

const initialState: LessonsState = {
  items: [],
  loaded: false,
};

export const loadLessons = createAsyncThunk('lessons/load', async () => {
  return await db.getAllLessons();
});

export const addLesson = createAsyncThunk('lessons/add', async (lesson: Lesson) => {
  await db.insertLesson(lesson);
  return lesson;
});

export const updateLesson = createAsyncThunk('lessons/update', async (lesson: Lesson) => {
  await db.updateLesson(lesson);
  return lesson;
});

export const deleteLesson = createAsyncThunk('lessons/delete', async (id: string) => {
  await db.deleteLesson(id);
  return id;
});

export const toggleTaskDone = createAsyncThunk(
  'lessons/toggleTaskDone',
  async (id: string, { getState }) => {
    const state = getState() as { lessons: LessonsState };
    const lesson = state.lessons.items.find((l) => l.id === id);
    if (!lesson) return id;
    const updated = { ...lesson, taskDone: !lesson.taskDone };
    await db.updateLesson(updated);
    return id;
  }
);

const lessonsSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadLessons.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loaded = true;
      })
      .addCase(addLesson.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        const i = state.items.findIndex((l) => l.id === action.payload.id);
        if (i !== -1) state.items[i] = action.payload;
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.items = state.items.filter((l) => l.id !== action.payload);
      })
      .addCase(toggleTaskDone.fulfilled, (state, action) => {
        const lesson = state.items.find((l) => l.id === action.payload);
        if (lesson) lesson.taskDone = !lesson.taskDone;
      });
  },
});

export default lessonsSlice.reducer;
