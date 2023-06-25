import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from './boards.slice';

const store = configureStore({
  reducer: {
    boards: boardsReducer,
  },
});

store.subscribe(() => {
  localStorage.setItem('reduxBoards', JSON.stringify(store.getState().boards));
});

export type StoreState = ReturnType<typeof store.getState>;

export default store;
