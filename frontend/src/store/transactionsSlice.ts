import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API =
  import.meta.env.VITE_API_URL ||
  'https://expense-tracker-application-1hf9.onrender.com/api';
import type { Transaction } from '../types/transctions';

// Define the shape of your slice state
interface TransactionsState {
  data: Transaction[];
  total: number;
  loading: boolean;
  error: string | null;
}

// ✅ Initial state with explicit type
const initialState: TransactionsState = {
  data: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetch',
  async (params: any) => {
    const res = await axios.get(`${API}/transactions`, { params });
    return res.data;
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/add',
  async (payload: Transaction) => {
    const res = await axios.post(`${API}/transactions`, payload);
    return res.data;
  }
);

export const updateTransaction = createAsyncThunk(
  'transaction/update',
  async ({ _id, payload }: any) => {
    console.log('payload in updateTransaction', payload);
    const res = await axios.put(`${API}/transactions/${_id}`, payload);
    return res.data;
  }
);

export const deleteTransaction = createAsyncThunk(
  '/transaction/delete',
  async (id: string) => {
    const res = await axios.delete(`${API}/transactions/${id}`);
    return res.data;
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchTransactions.fulfilled,
        (
          state,
          action: PayloadAction<{ data: Transaction[]; total: number }>
        ) => {
          state.loading = false;
          state.data = action.payload.data;
          state.total = action.payload.total;
        }
      )
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unknown error'; // ✅ Fix 1
      })
      .addCase(
        addTransaction.fulfilled,
        (state, action: PayloadAction<Transaction>) => {
          state.data.unshift(action.payload); // ✅ Fix 2
          state.total += 1;
        }
      );
  },
});

export default transactionsSlice.reducer;
