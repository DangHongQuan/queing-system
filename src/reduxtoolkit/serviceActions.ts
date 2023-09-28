import {
  fetchDataStart,
  fetchDataSuccess,
  fetchDataFailure,
  Data,

  
} from "./servicesSlice";
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
import ServiceData from "./ServiceData";
import { useSelector } from "react-redux";
import { firestore } from "../Firebase/Firebase";

export const fetchServiceData = (): AppThunk => async (dispatch, getState) => {
  dispatch(fetchDataStart());


    const firestore = getFirestore();
    const serviceCollectionRef = collection(firestore, "service");
    const querySnapshot = await getDocs(serviceCollectionRef);

    if (!querySnapshot.empty) {
      const rows: Data[] = querySnapshot.docs.map((doc) => doc.data() as Data);
      dispatch(fetchDataSuccess(rows));
    }

};

export const updateServiceData = createAsyncThunk(
  "service/updateServiceData",
  async (updatedData: ServiceData, { getState }) => {
      const { id_sv } = updatedData;
      const serviceDocRef = doc(firestore, "service", id_sv);
      const updatedDataObject = { ...updatedData };
      await updateDoc(serviceDocRef, updatedDataObject);
      return updatedData; // Trả về dữ liệu đã được cập nhật

  }
);

export const addNewService = createAsyncThunk(
  'service/addNewService',
  async (newServiceData: any) => {
    const firestore: Firestore = getFirestore();
    const newServiceDocRef = await addDoc(collection(firestore, 'service'), newServiceData);
    const newServiceId = newServiceDocRef.id;
    
    return { id_sv: newServiceId, ...newServiceData };
  }
);
