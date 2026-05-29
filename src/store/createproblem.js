import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../utils/axiosClient";

export const makeproblems = createAsyncThunk(
  "problem/create",
  async (problemData, { rejectWithValue }) => {
    try {
      const backendData = {
        problemid: problemData.problemid,
        title: problemData.title,
        description: problemData.description,
        difficulty: problemData.difficulty,
        constraints: problemData.constraints,
        examples: problemData.examples,
        hiddentestcases: problemData.hiddentestcases,
        refsolution: problemData.refsolution,
        tags: problemData.tags,
        category: problemData.category,
      };
      const response = await axiosClient.post("/problem/create", backendData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    } 
  },
);

const createproblem = createSlice({
  name: "problemCreator",
  initialState: {
    loading: false,
    success: false,
    data: null,
    error: null,
  },
  reducers: {
    clearCreateProblemState: (state) => {
      state.loading = false;
      state.success = false;
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeproblems.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(makeproblems.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(makeproblems.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload?.msg ||
          action.payload?.message ||
          action.payload ||
          "Failed to create problem";
      });
  },
});

export const { clearCreateProblemState } = createproblem.actions;
export default createproblem.reducer;
