import { Provider } from 'react-redux';
import { store } from './store/store';
import Dashboard from './pages/Dashbord';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 py-6 shadow-md mb-8 rounded-b-1xl">
          <h1
            className="text-3xl font-extrabold text-center text-transparent bg-clip-text
  bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-200
  tracking-wide drop-shadow-sm animate-fade-in"
          >
            💸 Expense Tracker
          </h1>
        </header>

        <main className="max-w-6xl mx-auto px-4">
          <Dashboard />
        </main>
      </div>
    </Provider>
  );
}

export default App;
