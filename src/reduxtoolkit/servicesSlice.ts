import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Key, ReactNode } from 'react';

export interface Data{
  description: ReactNode;
  id: Key | null | undefined;
  id_sv: string;
  name: string;
  describe: string;
  numberlever: string;
  status: string;
}


interface ServiceState {
  dataService: Data[]; // Thay thế Data bằng kiểu dữ liệu của dữ liệu lấy từ Firestore
  isLoading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  dataService: [],
  isLoading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    fetchDataStart(state) {
      state.isLoading = true;
      state.error = null;
    },
   
    fetchDataSuccess(state, action: PayloadAction<Data[]>) {
      state.isLoading = false;
      state.dataService = action.payload;
    },
    fetchDataFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure} = serviceSlice.actions;

export default serviceSlice.reducer;
