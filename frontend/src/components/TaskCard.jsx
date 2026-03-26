export default function TaskCard({ task, onEdit, onDelete }) {
  const priorityStyles = {
    HIGH: 'bg-red-100 text-red-600',
    MEDIUM: 'bg-yellow-100 text-yellow-600',
    LOW: 'bg-green-100 text-green-600',
  }

  const statusStyles = {
    TODO: 'bg-yellow-100 text-yellow-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    DONE: 'bg-green-100 text-green-700',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-800 text-sm">{task.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="text-xs text-indigo-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-xs text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>

      <div className="text-xs text-gray-400 space-y-1">
        {task.assignedToName && (
          <p>👤 Assigned to: <span className="text-gray-600">{task.assignedToName}</span></p>
        )}
        {task.dueDate && (
          <p>📅 Due: <span className="text-gray-600">{task.dueDate}</span></p>
        )}
      </div>
    </div>
  )
}