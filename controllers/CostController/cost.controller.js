import { pool } from '../../services/index.js';

class CostController {
  async addCost(data) {
    const { description, amount, user_id, expense_item_id, timestamp } = data;
    const cost = await pool.query(`INSERT INTO costs (description, amount, user_id, expense_item_id, timestamp) values ($1, $2, $3, $4, $5) RETURNING *`, [description, amount, user_id, expense_item_id, timestamp]);
    return cost.rows;
  }
  async getCostsForPeriod(data) {
    const { user_id, firstDay, lastDay } = data;
    const costs = await pool.query(`SELECT * FROM costs WHERE user_id = $1 AND timestamp > $2 AND timestamp < $3`, [user_id, firstDay, lastDay]);
    return costs.rows;
  }
}

export const costController = new CostController();