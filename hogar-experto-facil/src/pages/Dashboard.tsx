
import ClientDashboard from '@/components/ClientDashboard';
import ExpertoDashboard from '@/components/ExpertoDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  // Redirect to home if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const renderDashboard = () => {
    switch (user.userType) {
      case 'client':
        return <ClientDashboard />;
      case 'experto':
        return <ExpertoDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <ClientDashboard />;
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {renderDashboard()}
    </main>
  );
};

export default Dashboard;
