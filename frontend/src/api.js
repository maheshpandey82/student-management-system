const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  })
  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = await response.json()
      message = body.message || message
    } catch {}
    throw new Error(message)
  }
  if (response.status === 204) return null
  return response.json()
}

export const api = {
  students: (search = '') => request(`/students${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  createStudent: (student) => request('/students', { method: 'POST', body: JSON.stringify(student) }),
  updateStudent: (id, student) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(student) }),
  deleteStudent: (id) => request(`/students/${id}`, { method: 'DELETE' }),
  courses: () => request('/courses'),
  stats: () => request('/dashboard/stats')
}
