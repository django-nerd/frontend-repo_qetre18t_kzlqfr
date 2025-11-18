import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../lib/api'

export default function Dashboard({ onOpenProject }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const data = await api.listProjects()
      setProjects(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const create = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    await api.createProject({ name, description })
    setName('')
    setDescription('')
    fetchProjects()
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
        <h2 className="text-white text-xl font-semibold mb-4">Create Project</h2>
        <form onSubmit={create} className="grid gap-3 sm:grid-cols-2">
          <input className="bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white sm:col-span-2" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
          <button className="mt-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 sm:w-max" type="submit">Create</button>
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-semibold">Projects</h2>
          <button onClick={fetchProjects} className="text-blue-300 hover:text-blue-200 text-sm">Refresh</button>
        </div>
        {loading ? (
          <p className="text-blue-200">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-blue-200/80">No projects yet. Create one above.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.map((p) => (
              <button key={p._id} onClick={() => onOpenProject(p)} className="text-left bg-slate-900/60 border border-slate-700 rounded-lg p-4 hover:border-blue-500/40 transition-colors">
                <div className="text-white font-medium">{p.name}</div>
                <div className="text-sm text-blue-200/70 line-clamp-2">{p.description}</div>
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
