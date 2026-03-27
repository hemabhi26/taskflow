import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks'
import api from '../api/axios'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchCurrentUser()
    fetchTasks()
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/users/me')
      setCurrentUser(res.data)
    } catch (err) {
      console.error('Failed to fetch current user', err)
    }
  }

  const fetchTasks = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getTasks()
      setTasks(res.data)
    } catch (err) {
      setError('Failed to load tasks. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (form) => {
  try {
    if (editTask?.id) {
      await updateTask(editTask.id, form)
    } else {
      await createTask(form)
    }
    fetchTasks()
    } catch (err) {
      throw err  // ← remove the setError, just re-throw so TaskModal handles it
    }
  }

  const handleEdit = (task) => {
    setEditTask(task)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await deleteTask(id)
        fetchTasks()
      } catch (err) {
        setError('Failed to delete task. Please try again.')
      }
    }
  }

  const handleNewTask = () => {
    setEditTask(null)
    setShowModal(true)
  }

  const filtered = tasks
    .filter(t => statusFilter === 'ALL' || t.status === statusFilter)
    .filter(t => priorityFilter === 'ALL' || t.priority === priorityFilter)
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))

  const statusFilters = ['ALL', 'TODO', 'IN_PROGRESS', 'DONE']
  const priorityFilters = ['ALL', 'HIGH', 'MEDIUM', 'LOW']

  const priorityStyles = {
    ALL:    { active: 'bg-gray-700 text-white',   inactive: 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50' },
    HIGH:   { active: 'bg-red-500 text-white',    inactive: 'bg-white text-red-500 border border-red-300 hover:bg-red-50' },
    MEDIUM: { active: 'bg-yellow-500 text-white', inactive: 'bg-white text-yellow-600 border border-yellow-300 hover:bg-yellow-50' },
    LOW:    { active: 'bg-green-500 text-white',  inactive: 'bg-white text-green-600 border border-green-300 hover:bg-green-50' },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
            <p className="text-gray-500 text-sm mt-1">{tasks.length} total tasks</p>
          </div>
          <button
            onClick={handleNewTask}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            + New Task
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-500">!</span>
              <span>{error}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchTasks}
                className="text-red-600 underline hover:no-underline text-xs font-medium"
              >
                Retry
              </button>
              <button
                onClick={() => setError('')}
                className="text-red-400 hover:text-red-600 font-bold text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="text-xs text-gray-400 font-medium self-center w-16">Status</span>
          {statusFilters.map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                statusFilter === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-xs text-gray-400 font-medium self-center w-16">Priority</span>
          {priorityFilters.map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                priorityFilter === p
                  ? priorityStyles[p].active
                  : priorityStyles[p].inactive
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Tasks Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm">Loading tasks...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-2">No tasks found</p>
            <button
              onClick={handleNewTask}
              className="text-indigo-600 hover:underline text-sm"
            >
              Create your first task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <TaskModal
          task={editTask}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          currentUser={currentUser}
        />
      )}
    </div>
  )
}
