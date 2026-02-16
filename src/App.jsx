import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useSocketStore } from './stores/useSocketStore'

// Layout
import Layout from './components/Layout'

// Pages
import Home from './pages/Home'
import Settings from './pages/Settings'

// Brewing Pages
import BrewingChoice from './pages/brewing/BrewingChoice'
import RecipeList from './pages/brewing/RecipeList'
import RecipeConstructor from './pages/brewing/RecipeConstructor'
import BrewingProcess from './pages/brewing/BrewingProcess'
import History from './pages/brewing/History'

function App() {
  const { connect } = useSocketStore()
  
  // Auto-connect on app load
  useEffect(() => {
    connect()
  }, [connect])
  
  return (
    <Routes>
      {/* Main layout with connection status */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Brewing routes */}
        <Route path="/brew" element={<BrewingChoice />} />
        <Route path="/brew/list" element={<RecipeList />} />
        <Route path="/brew/create" element={<RecipeConstructor />} />
        <Route path="/brew/process" element={<BrewingProcess />} />
        <Route path="/brew/history" element={<History />} />
      </Route>
    </Routes>
  )
}

export default App
