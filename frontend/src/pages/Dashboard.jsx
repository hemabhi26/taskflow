import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getTasks } from '../api/tasks'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await getTasks()
      setTasks(res.data)
    } catch (err) {
      console.error('Failed to fetch tasks', err)
    } finally {
      setLoading(false)
    }
  }

  const todo = tasks.filter(t => t.status === 'TODO')
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS')
  const done = tasks.filter(t => t.status === 'DONE')

  const stats = [
    { label: 'Total Tasks', value: tasks.length, color: 'bg-indigo-500', icon: '📋' },
    { label: 'To Do', value: todo.length, color: 'bg-yellow-500', icon: '📝' },
    { label: 'In Progress', value: inProgress.length, color: 'bg-blue-500', icon: '🔄' },
    { label: 'Done', value: done.length, color: 'bg-green-500', icon: '✅' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's your task overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
              <div className={`${stat.color} text-white text-2xl w-12 h-12 rounded-lg flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Tasks</h2>
            <Link
              to="/tasks"
              className="text-sm text-indigo-600 hover:underline font-medium"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No tasks yet.{' '}
              <Link to="/tasks" className="text-indigo-600 hover:underline">
                Create your first task!
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      task.status === 'DONE' ? 'bg-green-500' :
                      task.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`} />
                    <span className="text-sm font-medium text-gray-700">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      task.priority === 'HIGH' ? 'bg-red-100 text-red-600' :
                      task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {task.priority}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      task.status === 'DONE' ? 'bg-green-100 text-green-600' :
                      task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}