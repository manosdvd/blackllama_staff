import { usersDB } from './db.js';

function str2ab(str) {
  return new TextEncoder().encode(str);
}

function ab2hex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hashPassword(password, salt) {
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw', str2ab(password), { name: 'PBKDF2' }, false, ['deriveBits', 'deriveKey']
  );
  
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: str2ab(salt),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  
  return ab2hex(derivedBits);
}

function generateSalt() {
  return crypto.randomUUID();
}

export class AuthService {
  static async register(username, plainPassword, role = 'Staff') {
    const normalizedUsername = username.trim().toLowerCase();
    
    if (usersDB.findOne(u => u.normalizedUsername === normalizedUsername)) {
      throw new Error('Username already exists');
    }

    const salt = generateSalt();
    const hashedPassword = await hashPassword(plainPassword, salt);

    const newUser = usersDB.create({
      username: username.trim(),
      normalizedUsername,
      passwordHash: hashedPassword,
      salt: salt,
      role: role,
      status: 'active'
    });

    return { id: newUser.id, username: newUser.username, role: newUser.role };
  }

  static async login(username, plainPassword) {
    const normalizedUsername = username.trim().toLowerCase();
    const user = usersDB.findOne(u => u.normalizedUsername === normalizedUsername);

    if (!user) throw new Error('Invalid username or password');
    if (user.status === 'inactive') throw new Error('Account deactivated by admin');

    const testHash = await hashPassword(plainPassword, user.salt);
    if (testHash !== user.passwordHash) {
      throw new Error('Invalid username or password');
    }

    const sessionToken = btoa(JSON.stringify({ id: user.id, username: user.username, role: user.role, exp: Date.now() + 86400000 }));
    localStorage.setItem('lawton_session', sessionToken);
    
    return this.getCurrentUser();
  }

  static logout() {
    localStorage.removeItem('lawton_session');
  }

  static getCurrentUser() {
    const token = localStorage.getItem('lawton_session');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token));
      if (payload.exp < Date.now()) {
        this.logout();
        return null;
      }
      const dbUser = usersDB.findOne(u => u.id === payload.id);
      if (!dbUser || dbUser.status === 'inactive') {
        this.logout();
        return null;
      }
      return { id: dbUser.id, username: dbUser.username, role: dbUser.role };
    } catch (e) {
      this.logout();
      return null;
    }
  }

  static isAdmin() {
    const user = this.getCurrentUser();
    if (!user) return false;
    // Map legacy roles to admin
    return ['Admin', 'Camp Director', 'Program Director'].includes(user.role);
  }

  static requireAdmin() {
    if (!this.isAdmin()) {
      throw new Error('Insufficient permissions');
    }
  }
}
