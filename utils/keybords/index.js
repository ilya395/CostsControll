import { Markup } from "telegraf";
import { ADD_COST, ADD_COST_OTHER_DAY, ADD_COST_TODAY, ADD_EXPENSE_ITEM, CHANGE_EXPENSE_ITEM, DELETE_EXPENSE_ITEM, EDIT_COST_AMOUNT_ACTION, EDIT_COST_DAY_ACTION, EDIT_COST_DESCRIPTION_ACTION, EDIT_COST_EXPENSE_ITEM_ACTION, SELECT_MONTH_SEE_EXPENSES, SHOW_COSTS_FOR_DATE, SHOW_COSTS_FOR_THIS_MONTH, SHOW_EXPENSE_ITEM } from "../../constants/index.js";
import { costController, expenseItemsController } from "../../controllers/index.js";

export function getMainMenu() {
    return Markup.keyboard([ // строки кнопок
        [ADD_EXPENSE_ITEM, ADD_COST],
        [SHOW_EXPENSE_ITEM, SHOW_COSTS_FOR_DATE],
        [SHOW_COSTS_FOR_THIS_MONTH, SELECT_MONTH_SEE_EXPENSES]
    ])
        .resize() // размерность кнопок
        // .extra() // отобразить клаву
}

export function yesNoKeyboard() {
  const array = [
      Markup.button.callback('Да', 'yes'),
      Markup.button.callback('Нет', 'no')
  ]
  return Markup.inlineKeyboard(array, {columns: 2});
}

export async function expenseItemKeyboard(id) {
  const items = await expenseItemsController.getItems(id);
  const array = items.map(item => {
    return Markup.button.callback(item.name, `expenseItem/${item.id}/${id}`)
  });
  return Markup.inlineKeyboard(array, {columns: 2});
}

export async function costsKeyboard(data) {
  const costs = await costController.getCostsForPeriod(data);
  const array = costs.map(item => {
    return Markup.button.callback(`${item.amount} - ${item.description}`, `cost/${item.id}/${data.user_id}`);
  });
  return Markup.inlineKeyboard(array, {columns: 3});
}

export function EditKeyboard() {
  const array = [
    Markup.button.callback('Редактировать', `edit`),
    Markup.button.callback('Удалить', `delete`)
  ]
  return Markup.inlineKeyboard(array, {columns: 2});
}

export function chooseDateKeyboard() {
  const array = [
    Markup.button.callback('Сегодня', ADD_COST_TODAY),
    Markup.button.callback('Другой день', ADD_COST_OTHER_DAY)
  ];
  return Markup.inlineKeyboard(array, {columns: 2});
}

export function chooseCostKeyboard() {
  const array = [
    Markup.button.callback('Цифра расхода', EDIT_COST_AMOUNT_ACTION),
    Markup.button.callback('Статья расхода', EDIT_COST_EXPENSE_ITEM_ACTION),
    Markup.button.callback('День расхода', EDIT_COST_DAY_ACTION),
    Markup.button.callback('Описание расхода', EDIT_COST_DESCRIPTION_ACTION),
  ];
  return Markup.inlineKeyboard(array, {columns: 2});
}