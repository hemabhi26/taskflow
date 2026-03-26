import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
              TaskFlow
            </Link>
            <Link to="/dashboard" className="text-sm text-gray-600 hover:text-indigo-600 transition">
              Dashboard
            </Link>
            <Link to="/tasks" className="text-sm text-gray-600 hover:text-indigo-600 transition">
              Tasks
            </Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="text-sm text-gray-600 hover:text-indigo-600 transition">
                Admin
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              👋 {user?.name}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              user?.role === 'ADMIN'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {user?.role}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}