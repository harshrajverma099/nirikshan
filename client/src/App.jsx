import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ExecutiveOverview from './pages/ExecutiveOverview';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import Milestones from './pages/Milestones';
import BudgetPage from './pages/Budget';
import Risks from './pages/Risks';
import Analytics from './pages/Analytics';
import ProjectMap from './pages/ProjectMap';
import Notifications from './pages/Notifications';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/executive" element={<ExecutiveOverview />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/milestones" element={<Milestones />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/risks" element={<Risks />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/map" element={<ProjectMap />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
