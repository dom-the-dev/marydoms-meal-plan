import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import Layout from './components/Layout'
import WeekPlanner from './pages/WeekPlanner'
import Recipes from './pages/Recipes'
import RecipeForm from './pages/RecipeForm'

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<WeekPlanner />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/new" element={<RecipeForm />} />
            <Route path="/recipes/:id" element={<RecipeForm />} />
          </Route>
        </Routes>
      </DataProvider>
    </BrowserRouter>
  )
}
