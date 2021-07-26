import { pool } from '../../services/index.js';

class UserController {
  async checkUser(id) {
    const check = await pool.query(`SELECT * FROM users WHERE telegram_id = $1`, [id]);
    return check.rows;
  }
  async addUser(data) {
    const { telegram_id, name, surname } = data;
    const user = await pool.query(`INSERT INTO users (telegram_id, name, surname) values ($1, $2, $3) RETURNING *`, [telegram_id, name, surname]);
    return user.rows;
  }
}

export const userController = new UserController();