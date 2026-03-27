import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function TaskModal({ task, onClose, onSave, currentUser }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '',
    assignedToId: '',
  })
  const [users, setUsers] = useState([])
  const [usersLoaded, setUsersLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const isAdmin = currentUser?.role === 'ADMIN'

  useEffect(() => {
    if (isAdmin) {
      api.get('/users')
        .then(res => { setUsers(res.data); setUsersLoaded(true) })
        .catch(() => { setUsers([]); setUsersLoaded(true) })
    } else {
      setUsersLoaded(true)
    }
  }, [isAdmin])

  useEffect(() => {
    if (!usersLoaded) return
    if (task) {
      setForm({
        title:        task.title       || '',
        description:  task.description || '',
        status:       task.status      || 'TODO',
        priority:     task.priority    || 'MEDIUM',
        dueDate:      task.dueDate     || '',
        assignedToId: task.assignedTo?.id ?? task.assignedToId ?? '',
      })
    }
  }, [task, usersLoaded])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // clear field error when user starts typing
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setLoading(true)
    try {
      const payload = { ...form }
      if (!isAdmin || !payload.assignedToId) {
        delete payload.assignedToId
      } else {
        payload.assignedToId = Number(payload.assignedToId)
      }
      await onSave(payload)
      onClose()
    } catch (err) {
      const data = err.response?.data
      if (data?.fields) {
        // backend returned field-level validation errors
        setFieldErrors(data.fields)
      } else {
        setError(data?.message || data?.error || 'Failed to save task. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

        {/* header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            {task?.id ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {/* general error banner */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                fieldErrors.title ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Task title"
            />
            {fieldErrors.title && (
              <p className="text-red-500 text-xs mt-1">⚠ {fieldErrors.title}</p>
            )}
          </div>

          {/* description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                fieldErrors.description ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Optional description"
            />
            {fieldErrors.description && (
              <p className="text-red-500 text-xs mt-1">⚠ {fieldErrors.description}</p>
            )}
          </div>

          {/* status + priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          {/* due date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* assignee — admin only */}
          {isAdmin && usersLoaded && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign To
                <span className="ml-1 text-xs text-gray-400 font-normal">(optional)</span>
              </label>
              <select
                name="assignedToId"
                value={form.assignedToId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">— Unassigned —</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Task'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}