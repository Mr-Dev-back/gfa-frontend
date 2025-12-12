import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Entry from './pages/Entry';
import Queue from './pages/Queue';
import { MainLayout } from './layouts/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="entry" element={<Entry />} />
          <Route path="queue" element={<Queue />} />
          <Route path="shipping" element={<div>Shipping Placeholder</div>} />
          <Route path="weighing" element={<div>Weighing Placeholder</div>} />
          <Route path="history" element={<div>History Placeholder</div>} />
          <Route path="admin" element={<div>Admin Placeholder</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
