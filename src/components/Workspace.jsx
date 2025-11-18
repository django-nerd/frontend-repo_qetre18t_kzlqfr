import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../lib/api'

export default function Workspace({ project, onBack }) {
  const [title, setTitle] = useState('')
  const [instructions, setInstructions] = useState('')
  const [context, setContext] = useState('')
  const [audience, setAudience] = useState('You are an expert assistant.')
  const [constraints, setConstraints] = useState('')
  const [format, setFormat] = useState('')
  const [examples, setExamples] = useState('')
  const [optimized, setOptimized] = useState('')
  const [score, setScore] = useState(null)
  const [prompts, setPrompts] = useState([])
  const [runs, setRuns] = useState([])
  const [selectedPromptId, setSelectedPromptId] = useState(null)
  const [model, setModel] = useState('openrouter/auto')
  const [loading, setLoading] = useState(false)

  const preview = useMemo(() => (
`Role: ${audience}\n\nGoal: ${instructions}\n\nContext:\n${context}\n\nConstraints:\n${constraints}\n\nOutput Format:\n${format}\n\nExamples:\n${examples}`
  ), [audience, instructions, context, constraints, format, examples])

  const loadPrompts = async () => {
    const data = await api.listPrompts(project._id)
    setPrompts(data)
  }

  const loadRuns = async (promptId) => {
    const data = await api.listRuns(promptId)
    setRuns(data)
  }

  useEffect(() => {
    loadPrompts()
  }, [])

  const create = async () => {
    setLoading(true)
    try {
      const res = await api.createPrompt({
        project_id: project._id,
        title,
        instructions,
        context,
        audience,
        constraints,
        format,
        examples,
      })
      setOptimized(res.optimized_prompt)
      setScore(res.score)
      setSelectedPromptId(res.id)
      await loadPrompts()
    } finally {
      setLoading(false)
    }
  }

  const testRun = async () => {
    if (!selectedPromptId) return
    setLoading(true)
    try {
      const res = await api.runTest({ prompt_id: selectedPromptId, model })
      await loadRuns(selectedPromptId)
      alert(`Run complete: ${res.latency_ms}ms`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-blue-300 hover:text-blue-200">← Back</button>
      <h2 className="text-white text-2xl font-bold">{project.name}</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Prompt Editor</h3>
            <div className="grid gap-3">
              <input className="bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
              <textarea className="min-h-[80px] bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white" placeholder="Instructions (goal)" value={instructions} onChange={(e)=>setInstructions(e.target.value)} />
              <textarea className="min-h-[80px] bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white" placeholder="Context" value={context} onChange={(e)=>setContext(e.target.value)} />
              <input className="bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white" placeholder="Audience / Role" value={audience} onChange={(e)=>setAudience(e.target.value)} />
              <textarea className="min-h-[60px] bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white" placeholder="Constraints" value={constraints} onChange={(e)=>setConstraints(e.target.value)} />
              <textarea className="min-h-[60px] bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white" placeholder="Output format" value={format} onChange={(e)=>setFormat(e.target.value)} />
              <textarea className="min-h-[60px] bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white" placeholder="Examples" value={examples} onChange={(e)=>setExamples(e.target.value)} />
              <button onClick={create} disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 w-max">Generate Optimized Prompt</button>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">History</h3>
            <div className="space-y-2">
              {prompts.length === 0 ? (
                <p className="text-blue-200/70">No prompts yet.</p>
              ) : prompts.map((p) => (
                <button key={p._id} onClick={() => { setSelectedPromptId(p._id); setOptimized(p.optimized_prompt); setScore(p.score); loadRuns(p._id) }} className={`w-full text-left p-3 rounded-lg border ${selectedPromptId === p._id ? 'border-blue-400 bg-slate-900/60' : 'border-slate-700 bg-slate-900/40'} hover:border-blue-400 transition-colors`}>
                  <div className="text-white font-medium">{p.title || 'Untitled'}</div>
                  <div className="text-xs text-blue-200/70">Score: {p.score?.toFixed?.(2) ?? '—'}</div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">Optimized Prompt</h3>
              {score != null && (
                <span className="text-xs px-2 py-1 rounded bg-blue-600/30 text-blue-200 border border-blue-500/30">Score {score.toFixed(2)}</span>
              )}
            </div>
            <pre className="whitespace-pre-wrap text-blue-100 text-sm bg-slate-900/60 border border-slate-700 rounded-lg p-4 min-h-[200px]">{optimized || preview}</pre>
          </div>

          <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <select value={model} onChange={(e)=>setModel(e.target.value)} className="bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-white">
                <option value="openrouter/auto">OpenRouter Auto</option>
                <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                <option value="openai/gpt-4o-mini">GPT-4o mini</option>
                <option value="meta-llama/llama-3.1-70b-instruct">Llama 3.1 70B</option>
                <option value="mistralai/mixtral-8x7b-instruct">Mixtral 8x7B</option>
              </select>
              <button onClick={testRun} disabled={!selectedPromptId || loading} className="bg-green-600 hover:bg-green-500 text-white rounded-lg px-4 py-2">Test Prompt</button>
            </div>
            <div className="space-y-2">
              {runs.length === 0 ? (
                <p className="text-blue-200/70">No runs yet.</p>
              ) : runs.map((r) => (
                <div key={r._id} className="p-3 rounded-lg border border-slate-700 bg-slate-900/60">
                  <div className="flex items-center justify-between">
                    <div className="text-white text-sm">{r.model}</div>
                    <div className="text-xs text-blue-200/70">{r.latency_ms} ms • Score {r.score?.toFixed?.(2)}</div>
                  </div>
                  <pre className="whitespace-pre-wrap text-blue-100 text-xs mt-2">{r.output?.slice(0, 2000)}</pre>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
