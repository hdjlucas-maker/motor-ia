import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Garage from './pages/Garage/Garage';
import Financial from './pages/Financial/Financial';
import AI from './pages/AI/AI';
import Reports from './pages/Reports/Reports';
import Auth from './pages/Auth/Auth';
import Subscription from './pages/Subscription/Subscription';
import RequireSubscription from './components/Auth/RequireSubscription';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected Routes (Wrapper in Layout) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<RequireSubscription><Dashboard /></RequireSubscription>} />
          <Route path="garage" element={<RequireSubscription><Garage /></RequireSubscription>} />
          <Route path="financial" element={<RequireSubscription><Financial /></RequireSubscription>} />
          <Route path="ai" element={<RequireSubscription><AI /></RequireSubscription>} />
          <Route path="reports" element={<RequireSubscription><Reports /></RequireSubscription>} />
          {/* Não é protegida pelo guard: precisa estar acessível mesmo com o teste expirado */}
          <Route path="subscription" element={<Subscription />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
