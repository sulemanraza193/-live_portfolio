import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiLeetcode, SiCodeforces, SiHackerrank } from 'react-icons/si';
import Reveal from './Reveal';
import { codingProfiles } from '../data/siteData';

const ICONS = {
  GitHub: FaGithub,
  LeetCode: SiLeetcode,
  Codeforces: SiCodeforces,
  HackerRank: SiHackerrank,
  LinkedIn: FaLinkedin,
};

const BRAND_COLORS = {
  GitHub: '#F8FAFC',
  LeetCode: '#FFA116',
  Codeforces: '#1F8ACB',
  HackerRank: '#2EC866',
  LinkedIn: '#0A66C2',
};

export default function CodingProfiles() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {codingProfiles.map((profile, i) => {
        const Icon = ICONS[profile.name] || FaGithub;
        const color = BRAND_COLORS[profile.name] || '#4F46E5';
        return (
          <Reveal key={profile.name} direction="up" delay={i * 0.06}>
            <a
              href={profile.url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-border bg-card hover:-translate-y-1.5 hover:border-secondary/50 transition-all text-center"
            >
              <span
                className="w-12 h-12 grid place-items-center rounded-xl bg-border/40 group-hover:scale-110 transition-transform"
                style={{ color }}
              >
                <Icon size={22} />
              </span>
              <span className="text-sm font-medium">{profile.name}</span>
            </a>
          </Reveal>
        );
      })}
    </div>
  );
}
