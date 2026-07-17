/**
 * Lightweight XSS sanitizer (xss-clean is deprecated / often uninstallable).
 * Strips script tags and javascript: URLs from request body/query/params.
 */
const stripXss = (value) => {
  if (typeof value === "string") {
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "");
  }

  if (Array.isArray(value)) {
    return value.map(stripXss);
  }

  if (value && typeof value === "object") {
    const cleaned = {};
    for (const [key, val] of Object.entries(value)) {
      cleaned[key] = stripXss(val);
    }
    return cleaned;
  }

  return value;
};

const xssSanitize = (req, res, next) => {
  if (req.body) req.body = stripXss(req.body);
  if (req.query) req.query = stripXss(req.query);
  if (req.params) req.params = stripXss(req.params);
  next();
};

export default xssSanitize;
