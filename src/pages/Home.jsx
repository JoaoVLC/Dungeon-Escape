import Card from '../components/Card.jsx'

const highlights = [
  {
    title: 'React Router',
    tag: 'Rotas',
    description: 'A navegação troca as páginas sem recarregar toda a aplicação.',
  },
  {
    title: 'Layout principal',
    tag: 'Layout',
    description: 'Header, menu, conteúdo e rodapé são compartilhados pelas páginas.',
  },
  {
    title: 'Componentes',
    tag: 'Reuso',
    description: 'Cards são usados para apresentar informações de forma organizada.',
  },
]

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero__content">
          <p className="eyebrow">TDE 2</p>
          <h1>Aplicação React com navegação</h1>
          <p>
            Projeto simples criado para demonstrar uma SPA com rotas, layout
            reutilizável e componentes em React.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Estrutura</p>
          <h2>O que a atividade contém</h2>
        </div>

        <div className="card-grid">
          {highlights.map((item) => (
            <Card
              key={item.title}
              title={item.title}
              tag={item.tag}
              description={item.description}
            />
          ))}
        </div>
      </section>
    </>
  )
}

export default Home
