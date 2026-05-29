import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import problemsReducer from './importdataslice'
import submissionsReducer from './submissionslice';
import createProblemReducer from './createproblem';
import aiReducer from './aislice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    problems: problemsReducer,
    submissions: submissionsReducer,
    problemCreator: createProblemReducer,
    ai: aiReducer
  }
});
