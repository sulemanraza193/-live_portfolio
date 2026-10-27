import { useEffect, useState } from 'react';
import { FiUsers, FiFolder, FiExternalLink } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa';
import Reveal from './Reveal';
import api from '../utils/api';

export default function GitHubStats() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get('/github/profile')
      .then((res) => setProfile(res.data))
      .catch(() => setError(true));
  }, []);

  if (error || !profile) return null;

  return (
    <Reveal direction="right">
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <img
          src={profile.avatar}
          alt={profile.name || profile.username}
          className="w-20 h-20 rounded-full border border-border shrink-0"
        />
        <div className="text-center sm:text-left flex-1">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <h3 className="font-display font-semibold text-lg">{profile.name || profile.username}</h3>
            <a
              href={profile.htmlUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="View on GitHub"
              className="text-muted hover:text-secondary transition-colors"
            >
              <FiExternalLink size={14} />
            </a>
          </div>
          <p className="text-sm text-muted mt-1">@{profile.username}</p>
          {profile.bio && <p className="text-sm text-muted mt-2 max-w-sm">{profile.bio}</p>}

          <div className="flex items-center justify-center sm:justify-start gap-6 mt-4 text-sm">
            <span className="flex items-center gap-1.5">
              <FaGithub size={14} className="text-secondary" />
              <strong>{profile.publicRepos}</strong> <span className="text-muted">repos</span>
            </span>
            <span className="flex items-center gap-1.5">
              <FiUsers size={14} className="text-secondary" />
              <strong>{profile.followers}</strong> <span className="text-muted">followers</span>
            </span>
            <span className="flex items-center gap-1.5">
              <FiFolder size={14} className="text-secondary" />
              <strong>{profile.following}</strong> <span className="text-muted">following</span>
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
