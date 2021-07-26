import { Markup } from "telegraf";
import { ADD_COST, ADD_COST_OTHER_DAY, ADD_COST_TODAY, ADD_EXPENSE_ITEM, SELECT_MONTH_SEE_EXPENSES, SHOW_COSTS_FOR_THIS_MONTH, SHOW_EXPENSE_ITEM } from "../../constants/index.js";
import { expenseItemsController } from "../../controllers/index.js";

export function getMainMenu() {
    return Markup.keyboard([ // строки кнопок
        [ADD_EXPENSE_ITEM, ADD_COST],
        [SHOW_EXPENSE_ITEM],
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

export async function expenseItemKeyboard() {
  const items = await expenseItemsController.getItems();
  const array = items.map(item => {
    return Markup.button.callback(item.name, `expenseItem/${item.id}`)
  });
  return Markup.inlineKeyboard(array, {columns: 2});
}

export function chooseDateKeyboard() {
  const array = [
    Markup.button.callback('Сегодня', ADD_COST_TODAY),
    Markup.button.callback('Другой день', ADD_COST_OTHER_DAY)
  ];
  return Markup.inlineKeyboard(array, {columns: 2});
}