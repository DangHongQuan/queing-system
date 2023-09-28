import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DataRoles{
    name: string;
    numberUser: string;
    describe: string;
    function_a: String;
    function_b: String;

}


interface rolesState {
 
  dataroles: DataRoles[]; // Thay thế Data bằng kiểu dữ liệu của dữ liệu lấy từ Firestore
  isLoading: boolean;
  error: string | null;
}

const initialState: rolesState = {
  dataroles: [],
  isLoading: false,
  error: null,
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    fetchDataStart(state) {
      state.isLoading = true;
      state.error = null;
    },
   
    fetchDataSuccess(state, action: PayloadAction<DataRoles[]>) {
      state.isLoading = false;
      state.dataroles = action.payload;
    },
    fetchDataFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure} = rolesSlice.actions;

export default rolesSlice.reducer;
