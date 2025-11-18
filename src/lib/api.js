export const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export const api = {
  health: () => request('/'),
  schema: () => request('/schema'),
  // Projects
  listProjects: () => request('/projects'),
  createProject: (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  // Prompts
  listPrompts: (projectId) => request(`/prompts${projectId ? `?project_id=${encodeURIComponent(projectId)}` : ''}`),
  createPrompt: (data) => request('/prompts', { method: 'POST', body: JSON.stringify(data) }),
  // Runs
  listRuns: (promptId) => request(`/runs${promptId ? `?prompt_id=${encodeURIComponent(promptId)}` : ''}`),
  runTest: (data) => request('/runs/test', { method: 'POST', body: JSON.stringify(data) }),
}
