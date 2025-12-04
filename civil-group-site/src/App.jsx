import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WebsiteContentProvider } from './context/WebsiteContentContext';
import ModernNavbar from './components/ModernNavbar';
import ModernHome from './pages/ModernHome';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <WebsiteContentProvider>
        <Router>
          <div className="app">
            <ModernNavbar />
            <Routes>
              <Route path="/" element={<ModernHome />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </WebsiteContentProvider>
    </AuthProvider>
  );
}

export default App;
