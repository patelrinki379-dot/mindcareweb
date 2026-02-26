import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { Home, Dumbbell, Apple, User, LogOut, Smile } from 'lucide-react';
import { FitnessProvider } from '../context/FitnessContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { toast } from 'sonner';

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/workouts', label: 'Workouts', icon: Dumbbell },
    { path: '/nutrition', label: 'Nutrition', icon: Apple },
    { path: '/mood', label: 'Mood', icon: Smile },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <FitnessProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">FitTrack</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, {user?.name}!</span>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </FitnessProvider>
  );
}