import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../store/transactionsSlice';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import type { Transaction } from '../types/transctions';
import type { RootState } from '../store/store';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { Loader, AlertCircle } from 'lucide-react';

const COLORS = ['#10B981', '#EF4444', '#6366F1', '#F59E0B', '#06B6D4'];

export default function Dashboard() {
  const dispatch = useDispatch<any>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.transactions
  );

  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: '',
  });

  // Fetch data whenever filters change
  useEffect(() => {
    dispatch(fetchTransactions(filters));
  }, [dispatch, filters]);

  // Compute summary data
  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    const byCategory: Record<string, number> = {};

    data.forEach((t: Transaction) => {
      if (t.type === 'income') income += Number(t.amount);
      else expense += Number(t.amount);
      byCategory[t.category] = (byCategory[t.category] || 0) + Number(t.amount);
    });

    const pieData = Object.keys(byCategory).map((k) => ({
      name: k,
      value: byCategory[k],
    }));

    return { income, expense, pieData };
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              💰 Expense Dashboard
            </h1>
            <p className="text-slate-500 text-sm">
              Track, analyze, and manage your finances efficiently.
            </p>
          </div>
        </div>

        {/* Filters + Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-lg border border-slate-200 rounded-2xl shadow-sm p-5 transition hover:shadow-md">
              {/* Filters */}
              <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-700">
                  Transactions
                </h2>
                <div className="flex flex-wrap gap-2">
                  <select
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={filters.type}
                    onChange={(e) =>
                      setFilters((s) => ({ ...s, type: e.target.value }))
                    }
                  >
                    <option value="">All</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>

                  <input
                    type="date"
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-400"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters((s) => ({ ...s, startDate: e.target.value }))
                    }
                  />
                  <input
                    type="date"
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-400"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters((s) => ({ ...s, endDate: e.target.value }))
                    }
                  />
                  <button
                    onClick={() =>
                      setFilters({
                        type: '',
                        category: '',
                        startDate: '',
                        endDate: '',
                      })
                    }
                    className="px-3 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Data States */}
              {/* {loading && (
                <div className="flex items-center justify-center py-6 text-slate-500">
                  <Loader className="animate-spin mr-2" />
                  transactions...
                </div>
              )} */}

              {loading && (
                <div className="space-y-4 animate-pulse">
                  {/* Table header skeleton */}
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-slate-200 rounded w-32"></div>
                    <div className="h-6 bg-slate-200 rounded w-24"></div>
                  </div>

                  {/* Table rows skeleton */}
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-slate-100/70 rounded-xl p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                        <div className="space-y-2">
                          <div className="h-3 w-24 bg-slate-200 rounded"></div>
                          <div className="h-3 w-16 bg-slate-100 rounded"></div>
                        </div>
                      </div>
                      <div className="h-4 w-12 bg-slate-200 rounded"></div>
                    </div>
                  ))}

                  {/* Footer / summary skeleton */}
                  <div className="flex justify-end">
                    <div className="h-5 bg-slate-200 rounded w-28"></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4" /> {String(error)}
                </div>
              )}

              {!loading && !error && <TransactionList transactions={data} />}
            </div>

            {/* Add Transaction Form */}
            <div className="bg-white/80 backdrop-blur-lg border border-slate-200 rounded-2xl shadow-sm p-5 transition hover:shadow-md">
              <TransactionForm />
            </div>
          </div>

          {/* Sidebar Summary */}
          <aside className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 shadow-sm">
                <div className="text-sm text-slate-600">Income</div>
                <div className="text-2xl font-bold text-green-600 mt-1">
                  ₹{Number(summary.income).toFixed(2)}
                </div>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 shadow-sm">
                <div className="text-sm text-slate-600">Expense</div>
                <div className="text-2xl font-bold text-red-500 mt-1">
                  ₹{Number(summary.expense).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white/80 backdrop-blur-lg border border-slate-200 rounded-2xl shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-600 mb-2">
                Spending Breakdown
              </h3>

              {loading ? (
                // ✅ PieChart Skeleton
                <div className="h-48 flex items-center justify-center">
                  <div className="relative w-32 h-32 animate-pulse">
                    <div className="absolute inset-0 rounded-full bg-slate-200"></div>
                    <div className="absolute inset-4 rounded-full bg-slate-100"></div>
                  </div>
                </div>
              ) : (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={summary.pieData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={70}
                        innerRadius={30}
                        label
                      >
                        {summary.pieData.map((_, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Bar Chart */}
            {/* Bar Chart */}
            <div className="bg-white/80 backdrop-blur-lg border border-slate-200 rounded-2xl shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-600 mb-2">
                Category Overview
              </h3>

              {loading ? (
                // ✅ BarChart Skeleton
                <div className="h-48 space-y-2 animate-pulse">
                  <div className="flex items-end justify-between h-full">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="w-6 bg-slate-200 rounded-t"
                        style={{
                          height: `${Math.random() * 60 + 30}%`,
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="h-2 w-8 bg-slate-100 rounded"
                      ></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={summary.pieData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value">
                        {summary.pieData.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
