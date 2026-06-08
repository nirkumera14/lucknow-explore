import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
    searchOpen: false,
    isOnline: navigator.onLine,
  },
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    closeSidebar: (state) => { state.sidebarOpen = false; },
    toggleSearch: (state) => { state.searchOpen = !state.searchOpen; },
    setOnlineStatus: (state, action) => { state.isOnline = action.payload; },
  }
});

export const { toggleSidebar, closeSidebar, toggleSearch, setOnlineStatus } = uiSlice.actions;
export default uiSlice.reducer;
