import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../utils/axiosClient";

export const fetchSubmissions = createAsyncThunk(
  "submissions/fetchSubmissions",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/problem/submissions/${id}`);
      return response.data.submissions || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const runCode = createAsyncThunk(
  "submissions/runCode",
  async ({ id, code, language }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/solution/runcode/${id}`, {
        code,
        language,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const submitCode = createAsyncThunk(
  "submissions/submitCode",
  async ({ id, code, language }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/solution/submit/${id}`, {
        code,
        language,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const submissionSlice = createSlice({
  name: "submissions",
  initialState: {
    submissionsLoading: false,
    runLoading: false,
    submitLoading: false,
    submissions: [],
    runResult: [],
    submitResult: null,
    error: null,
  },
  reducers: {
    clearSubmissionState: (state) => {
      state.submissions = [];
      state.runResult = [];
      state.submitResult = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubmissions.pending, (state) => {
        state.submissionsLoading = true;
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.submissionsLoading = false;
        state.submissions = action.payload;
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.submissionsLoading = false;
        state.submissions = [];
        state.error =
          action.payload?.message ||
          action.payload ||
          "Failed to fetch submissions";
      })
      .addCase(runCode.pending, (state) => {
        state.runLoading = true;
        state.error = null;
      })
      .addCase(runCode.fulfilled, (state, action) => {
        state.runLoading = false;
        state.runResult = action.payload;
      })
      .addCase(runCode.rejected, (state, action) => {
        state.runLoading = false;
        state.error = action.payload?.message || action.payload || "Run failed";
      })
      .addCase(submitCode.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(submitCode.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.submitResult = action.payload;
        state.submissions.push(action.payload);
      })
      .addCase(submitCode.rejected, (state, action) => {
        state.submitLoading = false;
        state.error =
          action.payload?.message || action.payload || "Submission failed";
      });
  },
});

export const { clearSubmissionState } = submissionSlice.actions;
export default submissionSlice.reducer;
