import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../utils/axiosClient";

export const sendAiPrompt = createAsyncThunk(
  "ai/sendAiPrompt",
  async (prompt, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/ai/getdata", { prompt });
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Request failed.";
      return rejectWithValue(message);
    }
  },
);

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    clearAiError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendAiPrompt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendAiPrompt.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendAiPrompt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Request failed.";
      });
  },
});

export const { clearAiError } = aiSlice.actions;
export default aiSlice.reducer;
