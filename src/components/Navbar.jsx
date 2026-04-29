import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="header">
      <nav className="navbar">
        <NavLink to="/" className="logo" aria-label="Ir para a página inicial">
          TDE<span>React</span>
        </NavLink>

        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/sobre">Sobre</NavLink>
          <NavLink to="/lista">Lista</NavLink>
          <NavLink to="/contato">Contato</NavLink>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
