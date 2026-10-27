import { useEffect, useState } from 'react';
import Reveal from './Reveal';
import api from '../utils/api';

const LEVEL_COLORS = [
  'var(--color-border)',
  'color-mix(in srgb, var(--color-primary) 35%, var(--color-border))',
  'color-mix(in srgb, var(--color-primary) 60%, var(--color-secondary))',
  'color-mix(in srgb, var(--color-primary) 30%, var(--color-secondary))',
  'var(--color-secondary)',
];

function buildWeeks(days) {
  if (!days.length) return [];
  const firstDayOfWeek = new Date(days[0].date).getDay(); // 0 = Sunday
  const padded = [...Array(firstDayOfWeek).fill(null), ...days];
  const weeks = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }
  return weeks;
}

export default function ContributionHeatmap() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/github/contributions').then((res) => setData(res.data)).catch(() => {});
  }, []);

  if (!data || data.contributions.length === 0) return null;

  const weeks = buildWeeks(data.contributions);

  return (
    <Reveal>
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold">Contribution Activity</h3>
          <span className="text-xs text-muted">{data.total} contributions in the last year</span>
        </div>

        <div className="overflow-x-auto pb-2">
          <div
            className="inline-grid grid-flow-col gap-[3px]"
            style={{ gridTemplateRows: 'repeat(7, 11px)' }}
          >
            {weeks.map((week, wi) =>
              week.map((day, di) => (
                <div
                  key={`${wi}-${di}`}
                  title={day ? `${day.date}: ${day.count} contribution${day.count === 1 ? '' : 's'}` : ''}
                  className="w-[11px] h-[11px] rounded-[2px]"
                  style={{ backgroundColor: day ? LEVEL_COLORS[day.level] : 'transparent' }}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-1.5 mt-3 text-[11px] text-muted">
          Less
          {LEVEL_COLORS.map((color, i) => (
            <span key={i} className="w-[10px] h-[10px] rounded-[2px]" style={{ backgroundColor: color }} />
          ))}
          More
        </div>
      </div>
    </Reveal>
  );
}
