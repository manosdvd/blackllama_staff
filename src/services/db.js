export class DatabaseService {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  _read() {
    return JSON.parse(localStorage.getItem(this.collectionName) || '[]');
  }

  _write(data) {
    localStorage.setItem(this.collectionName, JSON.stringify(data));
  }

  findAll(predicate = () => true) {
    return this._read().filter(predicate);
  }

  findOne(predicate) {
    return this._read().find(predicate) || null;
  }

  create(item) {
    const data = this._read();
    const newItem = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...item };
    data.push(newItem);
    this._write(data);
    return newItem;
  }

  update(id, updates) {
    const data = this._read();
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;
    data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
    this._write(data);
    return data[index];
  }

  delete(id) {
    const data = this._read();
    const filtered = data.filter(item => item.id !== id);
    this._write(filtered);
    return filtered.length !== data.length;
  }
}

export const usersDB = new DatabaseService('lawton_db_users');
export const appsDB = new DatabaseService('camp_lawton_applications');
export const campfiresDB = new DatabaseService('lawton_db_campfires');
