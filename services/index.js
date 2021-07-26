import { BD_USER, BD_PASSWORD, BD_HOST, BD_PORT, BD_NAME } from '../constants/index.js';

import pge from "pg";
const Pool = pge.Pool;
export const pool = new Pool({
  user: BD_USER,
  password: BD_PASSWORD,
  host: BD_HOST,
  port: BD_PORT,
  database: BD_NAME
});