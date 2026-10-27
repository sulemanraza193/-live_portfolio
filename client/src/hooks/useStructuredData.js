import { useEffect } from 'react';

// Injects a JSON-LD <script> tag into <head> for the lifetime of the
// component, and removes it on unmount/dependency change so navigating
// between pages doesn't accumulate stale structured data.
export function useStructuredData(data) {
  useEffect(() => {
    if (!data) return undefined;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [data]);
}
