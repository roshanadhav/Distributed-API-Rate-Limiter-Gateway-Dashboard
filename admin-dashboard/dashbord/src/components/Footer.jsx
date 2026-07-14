import { useSiteData } from '../hooks/useSiteData'
import { IconGithub, IconLinkedin, IconYoutube } from './Icons'

export default function Footer() {
  const { data } = useSiteData()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>© {year} {data?.profile?.name ?? 'Rohan Adhav'} — built with React</p>
        <div className="footer-links">
          {data?.profile?.social?.github && (
            <a href={data.profile.social.github} target="_blank" rel="noreferrer" aria-label="GitHub"><IconGithub width={16} height={16} /></a>
          )}
          {data?.profile?.social?.linkedin && (
            <a href={data.profile.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><IconLinkedin width={16} height={16} /></a>
          )}
          {data?.profile?.social?.youtube && (
            <a href={data.profile.social.youtube} target="_blank" rel="noreferrer" aria-label="YouTube"><IconYoutube width={16} height={16} /></a>
          )}
        </div>
      </div>
    </footer>
  )
}
