import { useState } from 'react'
import { motion } from 'framer-motion'
import Dashboard from './components/Dashboard'
import Workspace from './components/Workspace'

function App() {
  const [activeProject, setActiveProject] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.12),transparent_40%)]" />
      <div className="relative max-w-6xl mx-auto p-6">
        <header className="py-6 mb-6 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="PromptForge" className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">PromptForge</h1>
              <p className="text-sm text-blue-200/80">Turn instructions into model-optimized prompts</p>
            </div>
          </motion.div>
        </header>

        {activeProject ? (
          <Workspace project={activeProject} onBack={() => setActiveProject(null)} />
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 shadow-xl">
                <h2 className="text-white text-xl font-semibold mb-2">Start building prompts fast</h2>
                <p className="text-blue-200/80">Create a project, write your instructions, and generate an optimized prompt with structure, constraints, and examples. Test it against multiple models via OpenRouter or use the mock mode without a key.</p>
              </div>
            </motion.div>
            <Dashboard onOpenProject={(p) => setActiveProject(p)} />
          </>
        )}

        <footer className="mt-10 text-center text-blue-300/60 text-sm">
          Built with love • Heuristic scoring • OpenRouter-ready
        </footer>
      </div>
    </div>
  )
}

export default App
