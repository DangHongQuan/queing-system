import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Key, ReactNode } from 'react';

export interface DataNumber{

 id_cs: string;
 name_kh: string;
 name_dv: string;
 data: string;
 data_hsd: string;
 status: string;
 powersupply: string;

}


interface NumberState {
  data: DataNumber[]; // Thay thế Data bằng kiểu dữ liệu của dữ liệu lấy từ Firestore
  isLoading: boolean;
  error: string | null;
}

const initialState: NumberState = {
  data: [],
  isLoading: false,
  error: null,
};

const NumberSlice = createSlice({
  name: 'number',
  initialState,
  reducers: {
    fetchDataStart(state) {
      state.isLoading = true;
      state.error = null;
    },
   
    fetchDataSuccess(state, action: PayloadAction<DataNumber[]>) {
      state.isLoading = false;
      state.data = action.payload;
    },
    fetchDataFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure} = NumberSlice.actions;

export default NumberSlice.reducer;
