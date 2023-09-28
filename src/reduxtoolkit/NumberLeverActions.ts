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
import {
  fetchDataFailure,
  fetchDataStart,
  fetchDataSuccess,
} from "./NumberLeverSlice";
import Numberlever from "./NumberLaverData";

export const fetchNumberData = (): AppThunk => async (dispatch) => {
  dispatch(fetchDataStart());
    const firestore = getFirestore();
    const numberCollectionRef = collection(firestore, "number");
    const querySnapshot = await getDocs(numberCollectionRef);
      const rows: Numberlever[] = querySnapshot.docs.map(
        (doc) => doc.data() as Numberlever
      );
      dispatch(fetchDataSuccess(rows));
};

export const updateNumberData = createAsyncThunk(
  "Number/updateNumberData",
  async (updatedData: Numberlever, { getState }) => {
      const { id_cs } = updatedData;
      const numberDocRef = doc(firestore, "number", id_cs);
      const updatedDataObject = { ...updatedData };
      await updateDoc(numberDocRef, updatedDataObject);

      return updatedData; 
   
  }
);

export const addNewNumber = createAsyncThunk(
  "Number/addNewNumber",
  async (newNumberData: any) => {
    const firestore: Firestore = getFirestore();
    const newnumberDocRef = await addDoc(
      collection(firestore, "number"),
      newNumberData
    );
    const newNumberId = newnumberDocRef.id;

    return { id_cs: newNumberId, ...newNumberData };
  }
);
