import { Link } from 'react-router-dom'
import Card from './Card'
import { COVER_FALLBACK, withFallback } from '../utils/imageFallback'

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.slug}`} className="project-card">
      <Card>
        <img
          className="project-cover"
          src={project.cover}
          alt=""
          onError={withFallback(COVER_FALLBACK)}
        />
        <div className="project-card-body">
          <div className="project-name">{project.name}</div>
          <p className="project-tagline">{project.tagline}</p>
          <div className="project-stack">
            {project.stack?.map((s) => <span className="stack-pill" key={s}>{s}</span>)}
          </div>
          <div className="project-open">View case study →</div>
        </div>
      </Card>
    </Link>
  )
}
