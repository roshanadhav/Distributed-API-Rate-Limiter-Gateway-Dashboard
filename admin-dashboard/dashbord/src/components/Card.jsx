export default function Card({ eyebrow, children, className = '' }) {
  return (
    <div className={`card ${className}`.trim()}>
      {eyebrow && <div className="card-eyebrow">{eyebrow}</div>}
      {children}
    </div>
  )
}
