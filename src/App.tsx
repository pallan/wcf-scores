import { useState } from 'react'
import { Scoreboard } from './components/Scoreboard'
import { Standings } from './components/Standings'

type Tab = 'scores' | 'standings'

const TABS: { id: Tab; label: string }[] = [
  { id: 'scores',    label: 'Scores' },
  { id: 'standings', label: 'Standings' },
]

function App() {
  const [tab, setTab] = useState<Tab>('scores')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white py-4 px-6 shadow">
        <h1 className="text-2xl font-bold tracking-tight">WCF Scores</h1>
        <p className="text-blue-300 text-sm">World Junior Curling Championship 2025–26</p>
      </header>

      {/* Tab nav */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex gap-6 max-w-5xl mx-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <main className="max-w-5xl mx-auto p-6">
        {tab === 'scores'    && <Scoreboard season="2526" competition="WJCC" />}
        {tab === 'standings' && <Standings  season="2526" competition="WJCC" />}
      </main>

      <footer className="mt-8 py-4 border-t border-gray-200 text-center text-xs text-gray-400">
        Site data sourced from{' '}
        <a
          href="https://livescores.worldcurling.org"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600"
        >
          livescores.worldcurling.org
        </a>
      </footer>
    </div>
  )
}

export default App
