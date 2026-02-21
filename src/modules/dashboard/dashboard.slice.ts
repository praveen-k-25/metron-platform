import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
} from "@reduxjs/toolkit";
import { handleDashboardVehicles } from "./dashboard.api";
import { RootState } from "@/store/store";

interface Vehicle {
  id: string;
  username: string;
}

interface DashboardState extends EntityState<Vehicle, string> {
  map: string;
  loading: boolean;
  error: string | null;
}

const vehicleAdapter = createEntityAdapter<Vehicle, string>({
  selectId: (vehicle) => vehicle.id,
  sortComparer: (a: any, b: any) => a.username.localeCompare(b.username),
});

/* --------------  Async Thunk -------------- */
export const fetchVehicles = createAsyncThunk(
  "vehicle/fetchVehicles",
  async () => {
    const response = await handleDashboardVehicles();
    return response.data.data;
  },
);

/* --------------  Initial State -------------- */
const initialState: DashboardState = vehicleAdapter.getInitialState({
  map: "street",
  loading: false,
  error: null,
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setMaps: (state, action): void => {
      state.map = action.payload;
    },

    upsertVehicle: (state, action) => {
      const existing = state.entities[action.payload.user];
      if (existing) {
        vehicleAdapter.upsertOne(state, {
          ...existing,
          ...action.payload,
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state, _action) => {
        state.loading = true;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        vehicleAdapter.setAll(state, action.payload);
      });
  },
});

export const {
  selectAll: selectAllVehicles,
  selectById: selectVehiclesById,
  selectIds: selectVehicleIds,
  selectTotal: selectVehiclesTotal,
} = vehicleAdapter.getSelectors<RootState>(
  (state: RootState) => state.dashboard,
);

export default dashboardSlice.reducer;
export const { setMaps, upsertVehicle } = dashboardSlice.actions;
