function Contato() {
  return (
    <section className="content-page">
      <p className="eyebrow">Contato</p>
      <h1>Fale com a equipe</h1>
      <p>
        Esta página completa o conjunto mínimo de telas pedido na atividade e
        apresenta um formulário simples de contato.
      </p>

      <form className="contact-form">
        <label>
          Nome
          <input type="text" name="nome" placeholder="Seu nome" />
        </label>

        <label>
          E-mail
          <input type="email" name="email" placeholder="seu@email.com" />
        </label>

        <label>
          Mensagem
          <textarea name="mensagem" rows="5" placeholder="Escreva sua mensagem" />
        </label>

        <button className="button" type="button">
          Enviar mensagem
        </button>
      </form>
    </section>
  )
}

export default Contato
