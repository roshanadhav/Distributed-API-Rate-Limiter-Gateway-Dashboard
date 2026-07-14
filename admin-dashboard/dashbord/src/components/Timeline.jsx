export default function Timeline({ items, accent = 'accent' }) {
  return (
    <div className="timeline">
      {items.map((item, i) => (
        <div className={`timeline-item${accent === 'warm' ? ' warm' : ''}`} key={i}>
          <span className="timeline-node" />
          <div className="timeline-date">{item.label || item.date}</div>
          <div className="timeline-title">{item.title}</div>
          {item.detail && <div className="timeline-detail">{item.detail}</div>}
        </div>
      ))}
    </div>
  )
}
