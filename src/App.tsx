import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Entry from './pages/Entry';
import Queue from './pages/Queue';
import Shipping from './pages/Shipping';
import Weighing from './pages/Weighing';
import History from './pages/History';
import Admin from './pages/Admin';
import PublicTV from './pages/PublicTV';
import { MainLayout } from './layouts/MainLayout';
import { Toaster } from './components/ui/toast';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/tv" element={<PublicTV />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="entry" element={<Entry />} />
          <Route path="queue" element={<Queue />} />
          <Route path="shipping" element={<Shipping />} />
          <Route path="weighing" element={<Weighing />} />
          <Route path="history" element={<History />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
