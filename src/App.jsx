import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Garage from './pages/Garage/Garage';
import Financial from './pages/Financial/Financial';
import AI from './pages/AI/AI';
import Reports from './pages/Reports/Reports';
import Auth from './pages/Auth/Auth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected Routes (Wrapper in Layout) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="garage" element={<Garage />} />
          <Route path="financial" element={<Financial />} />
          <Route path="ai" element={<AI />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
