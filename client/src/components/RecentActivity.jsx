import { useEffect, useState } from 'react';
import { FiGitCommit, FiGitPullRequest, FiStar, FiGitBranch, FiPlusCircle, FiAlertCircle } from 'react-icons/fi';
import Reveal from './Reveal';
import api from '../utils/api';

const ICONS = {
  PushEvent: FiGitCommit,
  CreateEvent: FiPlusCircle,
  PullRequestEvent: FiGitPullRequest,
  IssuesEvent: FiAlertCircle,
  WatchEvent: FiStar,
  ForkEvent: FiGitBranch,
  PublicEvent: FiGitBranch,
};

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  const units = [
    ['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60],
  ];
  for (const [name, secs] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value} ${name}${value > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

export default function RecentActivity() {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    api.get('/github/activity').then((res) => setActivity(res.data)).catch(() => {});
  }, []);

  if (activity.length === 0) return null;

  return (
    <div>
      <h3 className="font-display font-semibold text-lg mb-4">Latest Activity</h3>
      <div className="rounded-2xl border border-border bg-card divide-y divide-border">
        {activity.map((item, i) => {
          const Icon = ICONS[item.type] || FiGitCommit;
          return (
            <Reveal key={i} direction="up" delay={i * 0.05} className="flex items-center gap-3 p-4">
              <span className="w-8 h-8 shrink-0 grid place-items-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-secondary">
                <Icon size={14} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{item.description}</p>
                <p className="text-xs text-muted">{timeAgo(item.createdAt)}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
