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
  async setTitle(data) {
    const { id, title, userId } = data;
    const items = await pool.query(`UPDATE expense_items SET name = $1 WHERE id = $2 AND user_id = $3`, [title, id, userId]);
    return items.rows;
  }
  async deleteItem(data) {
    const { id, userId } = data;
    const items = await pool.query(`DELETE FROM expense_items WHERE id = $1 AND user_id = $2`, [id, userId]);
    return items;
  }
}

export const expenseItemsController = new ExpenseItemsController();