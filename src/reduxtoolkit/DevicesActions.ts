
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
import { DataDevice, fetchDataDeviceFailure, fetchDataDeviceSuccess, fetchDateDeviceStart } from "./DeviceSlice";
import DeviceeData from "./DevicesData";
import { useEffect, useState } from "react";


  export const fetchDevicesData = (): AppThunk => async (dispatch, getState) => {
    dispatch(fetchDateDeviceStart());
      const firestore = getFirestore();
      const serviceCollectionRef = collection(firestore, "devices");
      const querySnapshot = await getDocs(serviceCollectionRef);
        const rows: DataDevice[] = querySnapshot.docs.map((doc) => {
          const data = doc.data() as DataDevice;
          const id = doc.id;
          return { ...data, id }; // Tạo object mới và gán giá trị cho thuộc tính id
        });
        dispatch(fetchDataDeviceSuccess(rows));
     
   
  };
  

export const updateDevicesData = createAsyncThunk(
  "devices/updateDevicesData",
  async (updatedData: DeviceeData, { getState }) => {
      const { id_dc } = updatedData;
      // Cập nhật dữ liệu trong Firestore
      const serviceDocRef = doc(firestore, "devices", id_dc);
      const updatedDataObject = { ...updatedData };
      await updateDoc(serviceDocRef, updatedDataObject);

      return updatedData; 
 
  }
);


const fetchIPAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return null;
  }
};

export const addNewDevices = createAsyncThunk(
  'service/addNewDevices',
  async (newDeviceData: any) => {
    const ipAddress = await fetchIPAddress();
   
      const firestore: Firestore = getFirestore();
      const newServiceDocRef = await addDoc(collection(firestore, 'devices'), { ...newDeviceData, ip: ipAddress });
      const newServiceId = newServiceDocRef.id;
      return { id_dc: newServiceId, ...newDeviceData };
    
  }
);

