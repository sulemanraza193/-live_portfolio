import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className="w-9 h-9 grid place-items-center rounded-full border border-border text-muted hover:text-text hover:border-secondary transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        <FiChevronLeft size={16} />
      </button>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-muted text-sm">…</span>}
          <button
            onClick={() => onChange(p)}
            className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
              p === page
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'text-muted hover:text-text hover:bg-border/40'
            }`}
          >
            {p}
          </button>
        </span>
      ))}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
        className="w-9 h-9 grid place-items-center rounded-full border border-border text-muted hover:text-text hover:border-secondary transition-colors disabled:opacity-40 disabled:pointer-events-none"
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
}
