import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction, fetchTransactions } from '../store/transactionsSlice';

const categories = [
  'salary',
  'groceries',
  'entertainment',
  'rent',
  'utilities',
  'other',
];

export default function TransactionForm() {
  const dispatch = useDispatch<any>();
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: 'other',
    date: new Date().toISOString().slice(0, 10),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!form.amount || Number(form.amount) <= 0)
      return 'Amount must be greater than 0';
    if (!form.description.trim()) return 'Provide a short description';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await dispatch(
        addTransaction({
          type: form.type,
          amount: Number(form.amount),
          description: form.description,
          category: form.category,
          date: form.date,
        })
      );
      dispatch(fetchTransactions({}));
      setForm({
        type: 'expense',
        amount: '',
        description: '',
        category: 'other',
        date: new Date().toISOString().slice(0, 10),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-3xl mx-auto mt-6 border border-slate-100">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">
        Add Transaction
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {error && (
          <div className="col-span-full text-sm text-red-500 bg-red-50 p-2 rounded-md">
            ⚠️ {error}
          </div>
        )}

        <select
          className="input"
          value={form.type}
          onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          className="input"
          value={form.amount}
          onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))}
        />

        <input
          type="text"
          placeholder="Category"
          className="input"
          list="categories"
          value={form.category}
          onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
        />
        <datalist id="categories">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>

        <input
          type="date"
          className="input"
          value={form.date}
          onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
        />

        <textarea
          className="input md:col-span-2 resize-none h-20"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm((s) => ({ ...s, description: e.target.value }))
          }
        />

        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Saving...
              </span>
            ) : (
              'Add Transaction'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
