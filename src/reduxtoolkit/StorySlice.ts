import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StoryData{
    name: string;
    date: string;
    ip: string;
    operations: string;
}


interface storyState {
 
  datastory: StoryData[]; // Thay thế Data bằng kiểu dữ liệu của dữ liệu lấy từ Firestore
  isLoading: boolean;
  error: string | null;
}

const initialState: storyState = {
  datastory: [],
  isLoading: false,
  error: null,
};

const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    fetchDataStart(state) {
      state.isLoading = true;
      state.error = null;
    },
   
    fetchDataSuccess(state, action: PayloadAction<StoryData[]>) {
      state.isLoading = false;
      state.datastory = action.payload;
    },
    fetchDataFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure} = storySlice.actions;

export default storySlice.reducer;
