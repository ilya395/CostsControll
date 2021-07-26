import { pool } from '../../services/index.js';

class ExpenseItemsController {
  async addItem(data) {
    const { name, user_id } = data;
    const check = await pool.query(`INSERT INTO expense_items (name, user_id) values ($1, $2) RETURNING *`, [name, user_id]);
    return check.rows;
  }
  async getItems(id) {
    const items = await pool.query(`SELECT * FROM expense_items WHERE user_id = $1`, [id]);
    return items.rows;
  }
}

export const expenseItemsController = new ExpenseItemsController();