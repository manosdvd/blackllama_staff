/**
 * Centralized API client for Camp Lawton Staff Portal.
 * All calls to Netlify Functions go through here.
 *
 * In development (Vite dev server), calls go to /.netlify/functions/<name>
 * In production (Netlify), they go to /api/<name> (via the redirect in netlify.toml)
 */

const BASE_URL = import.meta.env.DEV
  ? '/.netlify/functions'
  : '/api';

function getToken() {
  return localStorage.getItem('lawton_access_token');
}

function getHeaders(includeAuth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function parseResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  /** Register a new user */
  async register(username, password, role = 'Candidate') {
    const res = await fetch(`${BASE_URL}/auth-register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ username, password, role })
    });
    return parseResponse(res);
  },

  /** Log in with username and password */
  async login(username, password) {
    const res = await fetch(`${BASE_URL}/auth-login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ username, password })
    });
    return parseResponse(res);
  },

  /** Validate current session token and return user profile */
  async me() {
    const res = await fetch(`${BASE_URL}/auth-me`, {
      method: 'GET',
      headers: getHeaders(true)
    });
    return parseResponse(res);
  },

  /** ── Admin: User Management ── */
  admin: {
    async listUsers({ search = '', role = '', status = '', page = 1 } = {}) {
      const params = new URLSearchParams({ search, role, status, page });
      const res = await fetch(`${BASE_URL}/admin-users?${params}`, {
        headers: getHeaders()
      });
      return parseResponse(res);
    },

    async updateUser(userId, updates) {
      const res = await fetch(`${BASE_URL}/admin-users?id=${userId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      return parseResponse(res);
    },

    async deactivateUser(userId) {
      const res = await fetch(`${BASE_URL}/admin-users?id=${userId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return parseResponse(res);
    },

    async listApplications() {
      const res = await fetch(`${BASE_URL}/admin-applications`, {
        headers: getHeaders()
      });
      return parseResponse(res);
    },

    async updateApplication(appId, status, reviewNotes = '', assignedRole = 'Staff') {
      const res = await fetch(`${BASE_URL}/admin-applications?id=${appId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status, review_notes: reviewNotes, assigned_role: assignedRole })
      });
      return parseResponse(res);
    }
  },

  /** ── User: Applications ── */
  async getMyApplication() {
    const res = await fetch(`${BASE_URL}/admin-applications`, {
      headers: getHeaders()
    });
    return parseResponse(res);
  },

  async submitApplication(formData) {
    const res = await fetch(`${BASE_URL}/admin-applications`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ formData })
    });
    return parseResponse(res);
  },

  /** ── Blog / News Updates ── */
  blog: {
    async list() {
      const res = await fetch(`${BASE_URL}/blog`, {
        headers: getHeaders()
      });
      return parseResponse(res);
    },
    async create(postData) {
      const res = await fetch(`${BASE_URL}/blog`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(postData)
      });
      return parseResponse(res);
    }
  },

  /** ── Forum ── */
  forum: {
    async listPosts() {
      const res = await fetch(`${BASE_URL}/forum`, {
        headers: getHeaders()
      });
      return parseResponse(res);
    },
    async getPost(postId) {
      const res = await fetch(`${BASE_URL}/forum?post_id=${postId}`, {
        headers: getHeaders()
      });
      return parseResponse(res);
    },
    async createPost(title, content) {
      const res = await fetch(`${BASE_URL}/forum`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ title, content })
      });
      return parseResponse(res);
    },
    async createComment(postId, content) {
      const res = await fetch(`${BASE_URL}/forum?post_id=${postId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ content })
      });
      return parseResponse(res);
    },
    async deletePost(postId) {
      const res = await fetch(`${BASE_URL}/forum?id=${postId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return parseResponse(res);
    },
    async deleteComment(commentId) {
      const res = await fetch(`${BASE_URL}/forum?comment_id=${commentId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return parseResponse(res);
    }
  },

  /** ── Site Content (WYSIWYG edits) ── */
  siteContent: {
    async get(key) {
      const res = await fetch(`${BASE_URL}/site-content?key=${key}`, {
        headers: getHeaders()
      });
      return parseResponse(res);
    },
    async update(key, content) {
      const res = await fetch(`${BASE_URL}/site-content`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ key, content })
      });
      return parseResponse(res);
    }
  },

  /** ── Wiki Pages ── */
  wiki: {
    async list() {
      const res = await fetch(`${BASE_URL}/wiki`, {
        headers: getHeaders()
      });
      return parseResponse(res);
    },
    async get(slug) {
      const res = await fetch(`${BASE_URL}/wiki?slug=${slug}`, {
        headers: getHeaders()
      });
      return parseResponse(res);
    },
    async save(slug, title, content, category, tags = []) {
      const res = await fetch(`${BASE_URL}/wiki`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ slug, title, content, category, tags })
      });
      return parseResponse(res);
    },
    async delete(slug) {
      const res = await fetch(`${BASE_URL}/wiki?slug=${slug}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return parseResponse(res);
    }
  },

  /** ── Profile & Staff Directory ── */
  profiles: {
    async list() {
      const res = await fetch(`${BASE_URL}/profile-directory`, {
        headers: getHeaders()
      });
      return parseResponse(res);
    },
    async update(userId, updates) {
      const res = await fetch(`${BASE_URL}/profile-directory?id=${userId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      return parseResponse(res);
    },
    async updateSelf(updates) {
      const res = await fetch(`${BASE_URL}/profile-directory`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      return parseResponse(res);
    }
  }
};
