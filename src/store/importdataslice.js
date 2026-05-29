import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosClient'


export const getallproblems = createAsyncThunk(
  'data/getallproblems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/problem/getallproblems');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const dataslice = createSlice({
    name:'data',
    initialState:{
        ques:[],
        loading:true,
        error:null
    },
    extraReducers:(Builder)=>{
        Builder
        .addCase(getallproblems.pending,(state)=>{
              state.loading=true;
              state.error=null

        })

        .addCase(getallproblems.fulfilled,(state,action)=>{
                state.loading=false;
                state.ques=action.payload.allproblems;
        })

        .addCase(getallproblems.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.payload?.msg || "Failed to fetch problems";
        })

    }
})

export default dataslice.reducer;