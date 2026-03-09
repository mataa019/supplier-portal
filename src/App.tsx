import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Auth/login'
import Register from './Auth/register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

