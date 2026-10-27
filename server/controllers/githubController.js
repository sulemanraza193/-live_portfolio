import { getCached, setCached } from '../utils/cache.js';

const USERNAME = process.env.GITHUB_USERNAME;
const TOKEN = process.env.GITHUB_TOKEN; // optional — raises the rate limit and unlocks pinned repos
const TTL = 30 * 60 * 1000; // 30 minutes — GitHub data doesn't change fast enough to need less

function githubHeaders() {
  const headers = { Accept: 'application/vnd.github+json' };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  return headers;
}

function requireUsername(res) {
  if (!USERNAME) {
    res.status(503);
    throw new Error('GITHUB_USERNAME is not configured on the server');
  }
}

// GET /api/github/profile
export async function getProfile(req, res, next) {
  try {
    requireUsername(res);
    const cacheKey = 'github:profile';
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const response = await fetch(`https://api.github.com/users/${USERNAME}`, {
      headers: githubHeaders(),
    });
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
    const data = await response.json();

    const profile = {
      username: data.login,
      name: data.name,
      bio: data.bio,
      avatar: data.avatar_url,
      htmlUrl: data.html_url,
      followers: data.followers,
      following: data.following,
      publicRepos: data.public_repos,
      location: data.location,
    };

    setCached(cacheKey, profile, TTL);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

// GET /api/github/repos — top repositories by star count via REST.
// True "pinned" repos require GitHub's GraphQL API; getPinnedRepos below
// attempts that when a token is configured, and the frontend falls back
// to this endpoint's data when it isn't.
export async function getRepos(req, res, next) {
  try {
    requireUsername(res);
    const cacheKey = 'github:repos';
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const response = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`,
      { headers: githubHeaders() }
    );
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
    const data = await response.json();

    const repos = data
      .filter((r) => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        updatedAt: r.updated_at,
      }));

    setCached(cacheKey, repos, TTL);
    res.json(repos);
  } catch (err) {
    next(err);
  }
}

// GET /api/github/pinned — GraphQL, requires GITHUB_TOKEN. Returns an
// empty array (not an error) when no token is set so the frontend can
// silently fall back to /api/github/repos.
export async function getPinnedRepos(req, res, next) {
  try {
    requireUsername(res);
    if (!TOKEN) return res.json([]);

    const cacheKey = 'github:pinned';
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const query = `
      query ($username: String!) {
        user(login: $username) {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                description
                url
                stargazerCount
                forkCount
                primaryLanguage { name }
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { ...githubHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username: USERNAME } }),
    });
    if (!response.ok) throw new Error(`GitHub GraphQL error: ${response.status}`);
    const { data, errors } = await response.json();
    if (errors?.length) throw new Error(errors[0].message);

    const pinned = (data?.user?.pinnedItems?.nodes || []).map((r) => ({
      name: r.name,
      description: r.description,
      url: r.url,
      stars: r.stargazerCount,
      forks: r.forkCount,
      language: r.primaryLanguage?.name || null,
    }));

    setCached(cacheKey, pinned, TTL);
    res.json(pinned);
  } catch (err) {
    // Pinned repos are a nice-to-have — fail soft with an empty list
    // rather than breaking the page over a GraphQL hiccup.
    res.json([]);
  }
}

// GET /api/github/contributions — uses the public jogruber contributions
// API (no auth required) rather than GitHub's GraphQL API, so this works
// without a token.
export async function getContributions(req, res, next) {
  try {
    requireUsername(res);
    const cacheKey = 'github:contributions';
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`
    );
    if (!response.ok) throw new Error(`Contributions API error: ${response.status}`);
    const data = await response.json();

    const result = {
      total: data.total?.lastYear ?? 0,
      contributions: data.contributions || [],
    };

    setCached(cacheKey, result, TTL);
    res.json(result);
  } catch (err) {
    // Also a nice-to-have — degrade gracefully rather than 500ing the page.
    res.json({ total: 0, contributions: [] });
  }
}

// GET /api/github/activity — recent public events
export async function getActivity(req, res, next) {
  try {
    requireUsername(res);
    const cacheKey = 'github:activity';
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const response = await fetch(
      `https://api.github.com/users/${USERNAME}/events/public?per_page=10`,
      { headers: githubHeaders() }
    );
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
    const data = await response.json();

    const readable = {
      PushEvent: (e) => `Pushed ${e.payload.commits?.length || 0} commit(s) to ${e.repo.name}`,
      CreateEvent: (e) => `Created ${e.payload.ref_type} in ${e.repo.name}`,
      PullRequestEvent: (e) => `${e.payload.action === 'opened' ? 'Opened' : 'Updated'} a pull request in ${e.repo.name}`,
      IssuesEvent: (e) => `${e.payload.action === 'opened' ? 'Opened' : 'Updated'} an issue in ${e.repo.name}`,
      WatchEvent: (e) => `Starred ${e.repo.name}`,
      ForkEvent: (e) => `Forked ${e.repo.name}`,
      PublicEvent: (e) => `Made ${e.repo.name} public`,
    };

    const activity = data
      .filter((e) => readable[e.type])
      .slice(0, 5)
      .map((e) => ({
        type: e.type,
        description: readable[e.type](e),
        repo: e.repo.name,
        createdAt: e.created_at,
      }));

    setCached(cacheKey, activity, TTL);
    res.json(activity);
  } catch (err) {
    res.json([]);
  }
}
