import { pool } from '../../services/index.js';

class CostController {
  async addCost(data) {
    const { description, amount, user_id, expense_item_id, timestamp } = data;
    const cost = await pool.query(`INSERT INTO costs (description, amount, user_id, expense_item_id, timestamp) values ($1, $2, $3, $4, $5) RETURNING *`, [description, amount, user_id, expense_item_id, timestamp]);
    return cost.rows;
  }
  async getCostsForPeriod(data) {
    const { user_id, firstDay, lastDay } = data;
    const costs = await pool.query(`SELECT * FROM costs WHERE user_id = $1 AND timestamp >= $2 AND timestamp <= $3`, [user_id, firstDay, lastDay]);
    return costs.rows;
  }
  async getCost(data) {
    const { user_id, id } = data;
    const costs = await pool.query(`SELECT * FROM costs WHERE user_id = $1 AND id = $2`, [user_id, id]);
    return costs.rows;
  }
  async getCosts(user_id) {
    const costs = await pool.query(`SELECT * FROM costs WHERE user_id = $1`, [user_id]);
    return costs.rows;
  }
  async deleteCost(data) {
    const { id, user_id: userId } = data;
    const items = await pool.query(`DELETE FROM costs WHERE id = $1 AND user_id = $2`, [id, userId]);
    return items;
  }
  async setAmount(data) {
    const { id, userId, amount } = data;
    const items = await pool.query(`UPDATE costs SET amount = $1 WHERE id = $2 AND user_id = $3`, [amount, id, userId]);
    return items;
  }
  async setDescription(data) {
    const { id, userId, description } = data;
    const items = await pool.query(`UPDATE costs SET description = $1 WHERE id = $2 AND user_id = $3`, [description, id, userId]);
    return items;
  }
  async setExpenseItem(data) {
    const { id, userId, expense_item_id } = data;
    const items = await pool.query(`UPDATE costs SET expense_item_id = $1 WHERE id = $2 AND user_id = $3`, [expense_item_id , id, userId]);
    return items;
  }
  async setDay(data) {
    const { id, userId, timestamp } = data;
    const items = await pool.query(`UPDATE costs SET timestamp = $1 WHERE id = $2 AND user_id = $3`, [timestamp, id, userId]);
    return items;
  }
}

export const costController = new CostController();