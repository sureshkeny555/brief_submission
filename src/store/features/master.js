import { createSlice } from "@reduxjs/toolkit";
import { client } from "../../utils/client";

export const mastersSlice = createSlice({
  name: "masters",
  initialState: {
    productShow : [],
    productAdd : [],
    studyTypeShow : [],
    studyTypeAdd : [],
    researchTypeShow : [],
    researchTypeAdd : [],
    cityShow : [],
    cityAdd : [],
    departmentShow : [],
    departmentAdd : [],

  },
  reducers: {
    updateProductShowData:(state,action)=>{
        state.productShow = action.payload
    }
  },
});
export const {
    updateProductShowData

} = mastersSlice.actions;
export default mastersSlice.reducer;

export const productShowData = () => async () => {
  try {
    const response = await client.get('')
    const {data} = response
    updateProductShowData(data)
  } catch (error) {
    console.log(error)
  }
};
export const productAddData = () => async () => {
  try {
  } catch (error) {}
};
export const studyShowData = () => async () => {
  try {
  } catch (error) {}
};
export const studyAddData = () => async () => {
  try {
  } catch (error) {}
};
export const researchShowData = () => async () => {
  try {
  } catch (error) {}
};
export const researchAddData = () => async () => {
  try {
  } catch (error) {}
};
export const cityShowData = () => async () => {
  try {
  } catch (error) {}
};
export const cityAddData = () => async () => {
  try {
  } catch (error) {}
};
export const deptShowData = () => async () => {
  try {
  } catch (error) {}
};
export const deptAddData = () => async () => {
  try {
  } catch (error) {}
};
