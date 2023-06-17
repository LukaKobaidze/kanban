import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from './boards.slice';

const store = configureStore({
  reducer: {
    boards: boardsReducer,
  },
});

export type StoreState = ReturnType<typeof store.getState>

export default store;
