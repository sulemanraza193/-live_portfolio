export function AdminPageHeader({ title, description, action }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">{title}</h1>
        {description && <p className="text-sm text-muted mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({ label, error, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

export function TextInput({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm focus:border-secondary outline-none transition-colors ${className}`}
    />
  );
}

export function TextArea({ className = '', ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm focus:border-secondary outline-none transition-colors resize-none ${className}`}
    />
  );
}

export function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}
