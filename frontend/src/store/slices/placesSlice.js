// store/slices/placesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchPlaces = createAsyncThunk('places/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const { data } = await api.get(`/places?${query}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch places');
  }
});

export const fetchTrendingPlaces = createAsyncThunk('places/fetchTrending', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/places/trending');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error);
  }
});

export const fetchPlace = createAsyncThunk('places/fetchOne', async (idOrSlug, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/places/${idOrSlug}`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Place not found');
  }
});

export const toggleFavorite = createAsyncThunk('places/toggleFavorite', async (placeId, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/places/${placeId}/favorite`);
    return { placeId, ...data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.error);
  }
});

const placesSlice = createSlice({
  name: 'places',
  initialState: {
    list: [],
    trending: [],
    current: null,
    pagination: null,
    loading: false,
    trendingLoading: false,
    error: null,
    filters: { category: '', search: '', sort: '-rating' },
  },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    clearFilters: (state) => { state.filters = { category: '', search: '', sort: '-rating' }; },
    clearCurrent: (state) => { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaces.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPlaces.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchTrendingPlaces.pending, (state) => { state.trendingLoading = true; })
      .addCase(fetchTrendingPlaces.fulfilled, (state, action) => { state.trendingLoading = false; state.trending = action.payload; })
      .addCase(fetchTrendingPlaces.rejected, (state) => { state.trendingLoading = false; })
      .addCase(fetchPlace.pending, (state) => { state.loading = true; state.current = null; })
      .addCase(fetchPlace.fulfilled, (state, action) => { state.loading = false; state.current = action.payload; })
      .addCase(fetchPlace.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export const { setFilters, clearFilters, clearCurrent } = placesSlice.actions;
export default placesSlice.reducer;
