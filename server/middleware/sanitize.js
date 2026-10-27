// Strips keys starting with '$' or containing '.' from req.body to guard
// against MongoDB operator injection. Written by hand because the common
// express-mongo-sanitize package mutates req.query, which is a read-only
// getter in Express 5.
function sanitizeObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (obj && typeof obj === 'object') {
    const clean = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$') || key.includes('.')) continue;
      clean[key] = sanitizeObject(value);
    }
    return clean;
  }
  return obj;
}

export function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
}
