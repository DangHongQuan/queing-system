import {
    getFirestore,
    collection,
    getDocs,
    doc,
    updateDoc,
    Firestore,
    addDoc,
  } from "firebase/firestore";
  import { AppThunk, RootState } from "./store";
  import { createAsyncThunk } from "@reduxjs/toolkit";
  import { useSelector } from "react-redux";
  import { firestore } from "../Firebase/Firebase";
import { UserData, fetchDataFailure, fetchDataStart, fetchDataSuccess } from "./UserSliec";

  export const fetchUsersData = (): AppThunk => async (dispatch, getState) => {
    dispatch(fetchDataStart());
  
  
      const firestore = getFirestore();
      const UsersCollectionRef = collection(firestore, "users");
      const querySnapshot = await getDocs(UsersCollectionRef);
  
      if (!querySnapshot.empty) {
        const rows: UserData[] = querySnapshot.docs.map(
          (doc) => doc.data() as UserData
        );
        dispatch(fetchDataSuccess(rows));
      }
  
  };
  
  export const updateUsersData = createAsyncThunk(
    "Users/updateUsersData",
    async (updatedData: UserData, { getState }) => {
     
        const data = useSelector((state: RootState) => state.user.data);
        const { email } = updatedData;
  
        // Kiểm tra xem dữ liệu có tồn tại trong store hay không
        const existingData = data.find(
          (item: { email: string }) => item.email === email
        );
        const UsersDocRef = doc(firestore, "users", email);
        const updatedDataObject = { ...updatedData };
        await updateDoc(UsersDocRef, updatedDataObject);
  
        return updatedData; // Trả về dữ liệu đã được cập nhật
   
    }
  );
  
  export const addNewUsers = createAsyncThunk(
    "Users/addNewUsers",
    async (newUsersData: any) => {
      const firestore: Firestore = getFirestore();
      const newUsersDocRef = await addDoc(
        collection(firestore, "users"),
        newUsersData
      );
      const newUsersId = newUsersDocRef.id;
  
      return { id_cs: newUsersId, ...newUsersData };
    }
  );
  