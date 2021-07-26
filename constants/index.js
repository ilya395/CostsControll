import dotenv from 'dotenv';
dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN;

export const BD_USER = process.env.BD_USER;
export const BD_PASSWORD = process.env.BD_PASSWORD;
export const BD_HOST = process.env.BD_HOST;
export const BD_PORT = process.env.BD_PORT;
export const BD_NAME = process.env.BD_NAME;

export const START_SESSION_ACTION = "START_SESSION_ACTION";
export const ADD_EXPENSE_ITEM = "Добавь статью расходов";
export const ADD_COST = "Добавь траты";
export const SHOW_EXPENSE_ITEM = "Покажи статьи расходов";
export const SHOW_COSTS_FOR_THIS_MONTH = "Расходы за этот месяц";
export const SELECT_MONTH_SEE_EXPENSES = "Выбрать месяц чтобы увидеть расходы за него";

export const ADD_NEW_EXPENSE_ITEM_ACTION = "ADD_NEW_EXPENSE_ITEM_ACTION";
export const ADD_COST_ACTION = "ADD_COST_ACTION";
export const SAVE_EXPENSE_ITEM_SUCCESS_ACTION = "SAVE_EXPENSE_ITEM_SUCCESS_ACTION";
export const ADD_EXPENSE_ITEM_ACTION = "ADD_EXPENSE_ITEM_ACTION";

export const ADD_COST_TODAY = "ADD_COST_TODAY";
export const ADD_COST_OTHER_DAY = "ADD_COST_OTHER_DAY";
export const ADD_DATE_ACTION = "ADD_DATE_ACTION";
export const ADD_OTHER_DAY_ACTION = "ADD_OTHER_DAY_ACTION";
export const ADD_TODAY_ACTION = "ADD_TODAY_ACTION";
export const ADD_DESCRIPTION_ACTION = "ADD_DESCRIPTION_ACTION";

export const CUSSECC_SAVE_COST_ACTION = "CUSSECC_SAVE_COST_ACTION";