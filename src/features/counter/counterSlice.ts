import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

export interface CounterState {
  value: number;
  entities: [];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState: CounterState = {
  value: 0,
  entities: [],
  loading: 'idle',
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(incrementWithDelay.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(incrementWithDelay.fulfilled, (state) => {
      state.loading = 'idle';
      state.value += 1;
    });
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState): number => state.counter.value;
export const selectCountLoading = (state: RootState): string => state.counter.loading;

// First, create the thunk
export const incrementWithDelay = createAsyncThunk('counter/incrementWithDelay', async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return;
});

export default counterSlice.reducer;
