import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

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

  const handleSave = async (form) => {
    if (editTask?.id) {
      await updateTask(editTask.id, form)
    } else {
      await createTask(form)
    }
    fetchTasks()
  }

  const handleEdit = (task) => {
    setEditTask(task)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      await deleteTask(id)
      fetchTasks()
    }
  }

  const handleNewTask = () => {
    setEditTask(null)
    setShowModal(true)
  }

  const filtered = tasks
    .filter(t => filter === 'ALL' || t.status === filter)
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))

  const filters = ['ALL', 'TODO', 'IN_PROGRESS', 'DONE']

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

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-2">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Grid */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading tasks...</div>
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
        />
      )}
    </div>
  )
}