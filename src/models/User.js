const pool = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    // why static? Because we want to call these methods without creating an instance of the User class. They are utility functions that operate on the user data in the database, so it makes sense for them to be static.
  static async create(userData) {
    const connection = await pool.getConnection();
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const [result] = await connection.execute(
        'INSERT INTO users (full_name, email, phone, password, role, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [userData.full_name, userData.email, userData.phone || null, hashedPassword, userData.role || 'USER', userData.is_active !== false ? 1 : 0]
      );
      return result;
    } finally {
      connection.release();
    }
  }

  static async findByEmail(email) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0];
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } finally {
      connection.release();
    }
  }

  static async update(id, userData) {
    const connection = await pool.getConnection();
    try {
      const updates = [];
      const values = [];

      if (userData.full_name) {
        updates.push('full_name = ?');
        values.push(userData.full_name);
      }
      if (userData.email) {
        updates.push('email = ?');
        values.push(userData.email);
      }
      if (userData.phone !== undefined) {
        updates.push('phone = ?');
        values.push(userData.phone);
      }
      if (userData.password) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        updates.push('password = ?');
        values.push(hashedPassword);
      }
      if (userData.role) {
        updates.push('role = ?');
        values.push(userData.role);
      }
      if (userData.is_active !== undefined) {
        updates.push('is_active = ?');
        values.push(userData.is_active ? 1 : 0);
      }

      if (updates.length === 0) return null;

      values.push(id);
      const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
      const [result] = await connection.execute(query, values);
      return result;
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.execute(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      return result;
    } finally {
      connection.release();
    }
  }

  static async findAll(limit = 10, offset = 0) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users LIMIT ? OFFSET ?',
        [limit, offset]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  static async findByRole(role) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE role = ?',
        [role]
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  static async findActive() {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE is_active = 1'
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
