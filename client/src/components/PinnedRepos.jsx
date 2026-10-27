import { useEffect, useState } from 'react';
import { FiStar, FiGitBranch, FiExternalLink } from 'react-icons/fi';
import Reveal from './Reveal';
import api from '../utils/api';

export default function PinnedRepos() {
  const [repos, setRepos] = useState([]);
  const [label, setLabel] = useState('Pinned Repositories');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .get('/github/pinned')
      .then((res) => {
        if (res.data.length > 0) {
          setRepos(res.data);
        } else {
          // No token configured server-side, or nothing pinned — fall
          // back to top-starred repos so the section still has content.
          setLabel('Top Repositories');
          return api.get('/github/repos').then((r) => setRepos(r.data));
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (loaded && repos.length === 0) return null;

  return (
    <div>
      <h3 className="font-display font-semibold text-lg mb-4">{label}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {repos.map((repo, i) => (
          <Reveal key={repo.name} direction="up" delay={i * 0.06}>
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col h-full p-5 rounded-xl border border-border bg-card hover:border-secondary/50 hover:-translate-y-1 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-sm font-medium group-hover:text-secondary transition-colors truncate">
                  {repo.name}
                </span>
                <FiExternalLink size={13} className="text-muted shrink-0 mt-0.5" />
              </div>
              {repo.description && (
                <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-2 flex-1">
                  {repo.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-4 text-xs text-muted">
                {repo.language && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1"><FiStar size={12} /> {repo.stars}</span>
                <span className="flex items-center gap-1"><FiGitBranch size={12} /> {repo.forks}</span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
