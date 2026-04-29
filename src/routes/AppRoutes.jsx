import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import Contato from '../pages/Contato.jsx'
import Home from '../pages/Home.jsx'
import Lista from '../pages/Lista.jsx'
import Sobre from '../pages/Sobre.jsx'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/lista" element={<Lista />} />
          <Route path="/contato" element={<Contato />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
