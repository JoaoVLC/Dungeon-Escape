import Card from '../components/Card.jsx'

const pages = [
  {
    title: 'Página Home',
    tag: '01',
    description: 'Tela inicial com uma apresentação curta da aplicação.',
  },
  {
    title: 'Página Sobre',
    tag: '02',
    description: 'Explica o objetivo do TDE e a organização do projeto.',
  },
  {
    title: 'Página Lista',
    tag: '03',
    description: 'Mostra uma lista simples usando o componente Card.',
  },
  {
    title: 'Página Contato',
    tag: '04',
    description: 'Exibe um formulário visual com nome, e-mail e mensagem.',
  },
]

function Lista() {
  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">Lista</p>
        <h1>Páginas implementadas</h1>
        <p>
          Esta página atende ao requisito de lista e reutiliza o componente Card
          para mostrar os itens da aplicação.
        </p>
      </div>

      <div className="card-grid">
        {pages.map((item) => (
          <Card
            key={item.title}
            title={item.title}
            tag={item.tag}
            description={item.description}
          />
        ))}
      </div>
    </section>
  )
}

export default Lista
