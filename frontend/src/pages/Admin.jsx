import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import TaskModal from '../components/TaskModal'
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks'
import { getUsers, deleteUser } from '../api/users'
import api from '../api/axios'

export default function Admin() {
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('tasks')
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  // user edit modal state
  const [showUserModal, setShowUserModal] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [userForm, setUserForm] = useState({ name: '', email: '' })
  const [userError, setUserError] = useState('')
  const [userSaving, setUserSaving] = useState(false)

  useEffect(() => {
    fetchCurrentUser()
    fetchData()
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/users/me')
      setCurrentUser(res.data)
    } catch (err) {
      console.error('Failed to fetch current user', err)
    }
  }

  const fetchData = async () => {
    try {
      const [tasksRes, usersRes] = await Promise.all([getTasks(), getUsers()])
      setTasks(tasksRes.data)
      setUsers(usersRes.data)
    } catch (err) {
      console.error('Failed to fetch data', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTask = async (form) => {
    if (editTask?.id) {
      await updateTask(editTask.id, form)
    } else {
      await createTask(form)
    }
    fetchData()
  }

  const handleEditTask = (task) => {
    setEditTask(task)
    setShowModal(true)
  }

  const handleDeleteTask = async (id) => {
    if (window.confirm('Delete this task?')) {
      await deleteTask(id)
      fetchData()
    }
  }

  const handleDeleteUser = async (id) => {
    if (window.confirm('Delete this user? This will also delete their tasks!')) {
      await deleteUser(id)
      fetchData()
    }
  }

  const handleEditUser = (user) => {
    setEditUser(user)
    setUserForm({ name: user.name, email: user.email })
    setUserError('')
    setShowUserModal(true)
  }

  const handleSaveUser = async (e) => {
    e.preventDefault()
    setUserError('')
    setUserSaving(true)
    try {
      await api.put(`/users/${editUser.id}`, userForm)
      setShowUserModal(false)
      fetchData()
    } catch (err) {
      setUserError(err.response?.data?.error || 'Failed to update user')
    } finally {
      setUserSaving(false)
    }
  }

  const statusStyles = {
    TODO: 'bg-yellow-100 text-yellow-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    DONE: 'bg-green-100 text-green-700',
  }

  const priorityStyles = {
    HIGH: 'bg-red-100 text-red-600',
    MEDIUM: 'bg-yellow-100 text-yellow-600',
    LOW: 'bg-green-100 text-green-600',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all users and tasks</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Users', value: users.length, icon: '👥', color: 'bg-purple-500' },
            { label: 'Total Tasks', value: tasks.length, icon: '📋', color: 'bg-indigo-500' },
            { label: 'In Progress', value: tasks.filter(t => t.status === 'IN_PROGRESS').length, icon: '🔄', color: 'bg-blue-500' },
            { label: 'Completed', value: tasks.filter(t => t.status === 'DONE').length, icon: '✅', color: 'bg-green-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
              <div className={`${stat.color} text-white w-10 h-10 rounded-lg flex items-center justify-center text-lg`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'tasks'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Users ({users.length})
          </button>
        </div>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold text-gray-800">All Tasks</h2>
              <button
                onClick={() => { setEditTask(null); setShowModal(true) }}
                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-700 transition"
              >
                + New Task
              </button>
            </div>
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3">Title</th>
                    <th className="text-left px-4 py-3">Assigned To</th>
                    <th className="text-left px-4 py-3">Priority</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Due Date</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tasks.map(task => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{task.title}</td>
                      <td className="px-4 py-3 text-gray-500">{task.assignedToName || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityStyles[task.priority]}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[task.status]}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{task.dueDate || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTask(task)}
                            className="text-indigo-600 hover:underline text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-500 hover:underline text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-800">All Users</h2>
            </div>
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Role</th>
                    <th className="text-left px-4 py-3">Joined</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                      <td className="px-4 py-3 text-gray-500">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-indigo-600 hover:underline text-xs"
                          >
                            Edit
                          </button>
                          {user.role !== 'ADMIN' && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-500 hover:underline text-xs"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          task={editTask}
          onClose={() => setShowModal(false)}
          onSave={handleSaveTask}
          currentUser={currentUser}
        />
      )}

      {/* User Edit Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">Edit User</h2>
              <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            {userError && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">{userError}</div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Email address"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={userSaving}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {userSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
