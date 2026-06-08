import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import toast from 'react-hot-toast';

// ─── Async Thunks ─────────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('token', data.token);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Registration failed');
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data.user;
  } catch (err) {
    localStorage.removeItem('token');
    return rejectWithValue(err.response?.data?.error || 'Session expired');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/auth/profile', profileData);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Update failed');
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: false,
    initialLoading: true,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      toast.success('Logged out successfully');
    },
    clearError: (state) => { state.error = null; },
    setInitialLoading: (state, action) => { state.initialLoading = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        toast.success(action.payload.message || 'Welcome back!');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Register
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        toast.success(action.payload.message || 'Account created!');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => { state.initialLoading = true; })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.initialLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.initialLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        toast.success('Profile updated!');
      });
  }
});

export const { logout, clearError, setInitialLoading } = authSlice.actions;
export default authSlice.reducer;
