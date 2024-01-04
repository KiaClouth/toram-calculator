import {createSlice} from "@reduxjs/toolkit";
import {IGlobalData} from "@/types/store/common";
import {defaultGlobalData} from "../defaultValue/common";
interface IinitialState {
  globalData: IGlobalData;
}

const initialState: IinitialState = {
  globalData: defaultGlobalData,
};
const CommonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setGlobalData: (state, {payload}: {payload: Partial<IGlobalData>}) => {
      state.globalData = {...state.globalData, ...payload};
    },
    resetAll: () => initialState,
  },
});
export const {setGlobalData, resetAll} = CommonSlice.actions;
export default CommonSlice.reducer;
