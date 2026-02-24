import { Scoreboard } from './components/Scoreboard'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white py-4 px-6 shadow">
        <h1 className="text-2xl font-bold tracking-tight">WCF Scores</h1>
        <p className="text-blue-300 text-sm">World Junior Curling Championship 2025–26</p>
      </header>
      <main className="max-w-5xl mx-auto p-6">
        <Scoreboard season="2526" competition="WJCC" />
      </main>
    </div>
  )
}

export default App
