import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Key, ReactNode } from 'react';

export interface UserData {
    address: string;
    email: string;
    image: string;
    name: string;
    password: string;
    phone: string;
    role: string;
    status: string;
}

interface UsersState {
  data: UserData[]; // Thay thế Data bằng kiểu dữ liệu của dữ liệu lấy tEditRolesừ Firestore
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  data: [],
  isLoading: false,
  error: null,
};

const UsersSlice = createSlice({
  name: 'Users',
  initialState,
  reducers: {
    fetchDataStart(state) {
      state.isLoading = true;
      state.error = null;
    },
   
    fetchDataSuccess(state, action: PayloadAction<UserData[]>) {
      state.isLoading = false;
      state.data = action.payload;
    },
    fetchDataFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure} = UsersSlice.actions;

export default UsersSlice.reducer;
