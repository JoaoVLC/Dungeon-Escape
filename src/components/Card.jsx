function Card({ title, description, tag }) {
  return (
    <article className="card">
      <span>{tag}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

export default Card
