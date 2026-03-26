import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-indigo-600 text-xl font-semibold">Loading...</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" />

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" />
  }

  return children
}