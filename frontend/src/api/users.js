import api from './axios'

export const getUsers = () => api.get('/users')
export const getCurrentUser = () => api.get('/users/me')
export const getUserById = (id) => api.get(`/users/${id}`)
export const deleteUser = (id) => api.delete(`/users/${id}`)