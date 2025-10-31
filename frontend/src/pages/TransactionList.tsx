import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Pencil, Trash2, X } from 'lucide-react';
import {
  deleteTransaction,
  updateTransaction,
} from '../store/transactionsSlice';
import type { AppDispatch } from '../store/store';
import type { Transaction } from '../types/transctions';

interface Props {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'income',
  });

  const openEdit = (t: Transaction) => {
    setEditing(t);
    setForm({
      description: t.description,
      amount: String(t.amount),
      category: t.category,
      type: t.type,
    });
  };

  const handleSave = async () => {
    if (!editing?._id) return;
    await dispatch(updateTransaction({ _id: editing._id, payload: form }));
    setEditing(null);

    window.location.reload();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(id));
    }
    window.location.reload();
  };

  if (!transactions?.length) {
    return (
      <div className="text-sm text-slate-500 mt-4 text-center bg-slate-50 rounded-lg py-4">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md w-full max-w-3xl mx-auto mt-8 border border-slate-100">
      <h2 className="text-lg font-semibold mb-3 text-slate-700">
        Recent Transactions
      </h2>

      <div className="divide-y">
        {transactions.map((t) => (
          <div
            key={t._id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 hover:bg-slate-50 transition rounded-xl px-2 sm:px-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span
                className={`text-xs px-2 py-1 rounded-full self-start sm:self-auto ${
                  t.type === 'income'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {t.type.toUpperCase()}
              </span>
              <span className="font-medium text-slate-800">
                {t.description}
              </span>
              <span className="text-xs text-slate-500">
                {t.category} • {new Date(t.date).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0">
              <span
                className={`font-semibold ${
                  t.type === 'income' ? 'text-green-600' : 'text-red-500'
                }`}
              >
                ₹{Number(t.amount).toFixed(2)}
              </span>

              <button
                onClick={() => openEdit(t)}
                className="p-2 hover:bg-blue-50 rounded-full transition"
                title="Edit"
              >
                <Pencil size={16} className="text-blue-600" />
              </button>
              <button
                onClick={() => t._id && handleDelete(t._id)}
                className="p-2 hover:bg-red-50 rounded-full transition"
                title="Delete"
              >
                <Trash2 size={16} className="text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✨ Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-700">
                Edit Transaction
              </h3>
              <button onClick={() => setEditing(null)}>
                <X size={20} className="text-slate-500 hover:text-slate-700" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Description"
                className="input"
              />
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Amount"
                className="input"
              />
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Category"
                className="input"
              />
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="input"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="flex justify-end mt-5 gap-2">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 text-sm rounded-lg bg-slate-200 hover:bg-slate-300"
              >
                Cancel
              </button>
              <button onClick={handleSave} className="btn">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
