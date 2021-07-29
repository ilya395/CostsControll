// require('dotenv').config();

// const { Telegraf } = require('telegraf');
// const { session } = require('@telegraf/session');
import { Telegraf } from 'telegraf';
import session from '@telegraf/session';
import { ADD_COST, ADD_COST_ACTION, ADD_EXPENSE_ITEM, ADD_NEW_EXPENSE_ITEM_ACTION, ADD_EXPENSE_ITEM_ACTION, BOT_TOKEN, SAVE_EXPENSE_ITEM_SUCCESS_ACTION, START_SESSION_ACTION, ADD_DATE_ACTION, ADD_COST_TODAY, ADD_COST_OTHER_DAY, ADD_DESCRIPTION_ACTION, CUSSECC_SAVE_COST_ACTION, ADD_TODAY_ACTION, ADD_OTHER_DAY_ACTION, SHOW_COSTS_FOR_THIS_MONTH, SELECT_MONTH_SEE_EXPENSES, SHOW_EXPENSE_ITEM, CHANGE_EXPENSE_ITEM_ACTION, EDIT_OR_DELETE_ACTION, EDIT_EXPENSE_ITEM_ACTION, EDIT_OR_DELETE_EXPENSE_ITEM_ACTION, SUCCESS_EDIT_EXPENSE_ITEM_ACTION, DELETE_EXPENSE_ITEM_ACTION, SUCCESS_DELETE_EXPENSE_ITEM_ACTION } from '../../constants/index.js';
import { costController, expenseItemsController, userController } from '../../controllers/index.js';
import { chooseDateKeyboard, EditKeyboard, expenseItemEditKeyboard, expenseItemKeyboard, getMainMenu, yesNoKeyboard } from '../../utils/keybords/index.js';

const Bot = new Telegraf(BOT_TOKEN);

export const BotModule = () => {
  Bot.use(session());

  Bot.start(async ctx => {
    ctx.session.status = START_SESSION_ACTION;

    ctx.session.user = {
        telegram_id: ctx.update.message.from.id,
        username: ctx.update.message.from.username,
        firstName: ctx.update.message.from.first_name,
        lastName: ctx.update.message.from.last_name
    }

    const user = await userController.checkUser(ctx.update.message.from.id);

    if (user.length > 0) {
      ctx.session.user.id = user[0].id;
      ctx.replyWithHTML(`Привет, ${user[0].name || 'тот у кого пока нет имени'}!\n Что будем делать? \n\n`, getMainMenu())
    } else {
      const addedUser = await userController.addUser({
        telegram_id: ctx.update.message.from.id,
        name: ctx.update.message.from.first_name,
        surname: ctx.update.message.from.last_name,
      })
      const saveInSession = () => {
        ctx.session.user.id = addedUser[0].id
      }
      await saveInSession();
      ctx.replyWithHTML('Привет!\n Что будем делать? \n\n', getMainMenu())
    }
  });

  Bot.hears(ADD_EXPENSE_ITEM, async (ctx) => {
    ctx.session.status = ADD_NEW_EXPENSE_ITEM_ACTION;
    ctx.reply(
      'Чтобы быстро добавить Статью расходов, просто напиши ее и отправь боту',
    );
  });
  Bot.hears(ADD_COST, (ctx) => {
    ctx.session.status = ADD_COST_ACTION;
    ctx.reply(
      'Чтобы быстро добавить расходы, просто напиши цифру и отправь боту'
    );
  });
  Bot.hears(SHOW_COSTS_FOR_THIS_MONTH, async ctx => {
    ctx.session.status = SHOW_COSTS_FOR_THIS_MONTH;
    const today = new Date();
    const todayTimestamp = today.getTime();
    const firstDay = (new Date(today.getFullYear(), today.getMonth(), 1, 12)).getTime();
    const lastDay = (new Date(today.getFullYear(), today.getMonth() + 1, 0, 12)).getTime();
    const data = {
      user_id: ctx.session.user.id,
      firstDay,
      lastDay
    }
    const costs = await costController.getCostsForPeriod(data);
    const expenseItemsArray = await expenseItemsController.getItems(ctx.session.user.id);
    if (costs.length > 0) {
      const res = expenseItemsArray.reduce((accumulator, item) => {
        const allCosts = costs.filter(i => +i.expense_item_id === +i.id);
        const allCostsSum = allCosts.reduce((accum, j) => {
          return accum += j.amount;
        }, 0);
        return accumulator += `${item.name}: ${allCostsSum};\n`;
      }, "");
      ctx.replyWithHTML(`<b>Список расходов за текущий месяц:</b>\n\n${res}`)
    } else {
      ctx.replyWithHTML(`<b>Нет расходов</b>\n`)
    }
  });
  Bot.hears(SELECT_MONTH_SEE_EXPENSES, ctx => {
    ctx.session.status = SELECT_MONTH_SEE_EXPENSES;
    ctx.reply(
      'Чтобы просмотреть расходы за интересующий тебя месяц, просто напиши дату в формате ММ.ГГГГ и отправь боту'
    );
  });
  Bot.hears(SHOW_EXPENSE_ITEM, async ctx => { // *
    ctx.session.status = SHOW_EXPENSE_ITEM;
    const items = await expenseItemsController.getItems(ctx.session.user.id);
    if (items.length > 0) {
      // const result = items.reduce((accumulator, item) => {
      //   return accumulator + `${item.name}\n`;
      // }, "");

      // ctx.replyWithHTML(`<b>Список Статей расходов:</b>\n\n${result}`)
      // const menu = await expenseItemEditKeyboard(ctx.session.user.id);
      // ctx.reply(`Список Статей расходов: `, menu);

      const keyboard = await expenseItemKeyboard(ctx.session.user.id);
      ctx.reply(
        'Список Статей расходов(кликни для редактирования или уаления): ',
        keyboard
      );
      ctx.session.status = CHANGE_EXPENSE_ITEM_ACTION;
    } else {
      ctx.reply('Статей расходов нет...');
    }
  });
  Bot.action(['edit', 'delete'], async ctx => {
    const status = ctx.session.status;
    if (status === EDIT_OR_DELETE_EXPENSE_ITEM_ACTION) {
      if (ctx.callbackQuery.data === 'delete') {
        ctx.replyWithHTML(
          `Вы действительно хотите удалить эту Статью расходов?`,
          yesNoKeyboard()
        )
        ctx.session.status = DELETE_EXPENSE_ITEM_ACTION;
      }
      if (ctx.callbackQuery.data === 'edit') {
        ctx.editMessageText('Введите новое название Статьи расходов');
        ctx.session.status = EDIT_EXPENSE_ITEM_ACTION;
      }
    }
  });
  Bot.on('text', async ctx => {
    const status = ctx.session.status;

    switch (status) {
      case ADD_NEW_EXPENSE_ITEM_ACTION:
        ctx.session.expenseItemText = ctx.message.text;
        ctx.replyWithHTML(
          `Вы действительно хотите добавить Статью расходов:\n\n`+
          `<i>${ctx.message.text}</i>`,
          yesNoKeyboard()
        )
        break;

      case ADD_COST_ACTION:
        ctx.session.amount = ctx.message.text;
        ctx.replyWithHTML(
          `Вы действительно хотите добавить расход:\n\n`+
          `<i>${ctx.message.text} руб.</i>`,
          yesNoKeyboard()
        )
        break;

      case ADD_OTHER_DAY_ACTION:
        const string = ctx.message.text;
        const dateArray = string.split('.');
        const year = dateArray[2];
        const month = dateArray[1].indexOf(0) > -1 ? dateArray[1].slice(1,2) : dateArray[1];
        const day = dateArray[0];
        if (day && month && year) {
          const date = new Date(year, month, day, 12, 0);
          ctx.session.date = date.getTime();
          ctx.replyWithHTML(
            `Вы действительно хотите добавить расходы за:\n\n`+
            `<i>${date.getDate()}.${date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()}.${date.getFullYear()}</i>`,
            yesNoKeyboard()
          );
          ctx.session.status = ADD_TODAY_ACTION;
        } else {
          ctx.reply(
            'Введите дату расхода в формате: ДД.ММ.ГГГГ'
          );
          ctx.session.status = ADD_OTHER_DAY_ACTION;
        }

        break;

      case ADD_DESCRIPTION_ACTION:
        ctx.session.description = ctx.message.text;
        ctx.replyWithHTML(
          `Вы действительно хотите добавить описание:\n\n`+
          `<i>${ctx.message.text}</i>`,
          yesNoKeyboard()
        )
        break;

      case SELECT_MONTH_SEE_EXPENSES:
        const str = ctx.message.text;
        const dateArr = str.split('.');
        const selectedMonth = dateArr[0];
        const selectedYear = dateArr[1];
        if (selectedMonth && selectedYear) {
          const firstDay = (new Date(selectedYear, selectedMonth, 1, 12)).getTime();
          const lastDay = (new Date(selectedYear, selectedMonth + 1, 0, 12)).getTime();
          const data = {
            user_id: ctx.session.user.id,
            firstDay,
            lastDay
          }
          const costs = await costController.getCostsForPeriod(data);
          const expenseItemsArray = await expenseItemsController.getItems(ctx.session.user.id);
          if (costs.length > 0) {
            const res = expenseItemsArray.reduce((accumulator, item) => {
              const allCosts = costs.filter(i => +i.expense_item_id === +i.id);
              const allCostsSum = allCosts.reduce((accum, j) => {
                return accum += j.amount;
              }, 0);
              return accumulator += `${item.name}: ${allCostsSum};\n`;
            }, "");
            ctx.replyWithHTML(`<b>Список расходов за ${str}:</b>\n\n${res}`)
          } else {
            ctx.replyWithHTML(`<b>Нет расходов</b>\n`)
          }
        } else {
          ctx.reply('Не понял, что за дата...');
        }
        break;

      case EDIT_EXPENSE_ITEM_ACTION:
        ctx.session.changeExpenseItemTitle = ctx.message.text;
        ctx.replyWithHTML(
          `Вы действительно хотите изменить Статью расходов на:\n\n`+
          `<i>${ctx.message.text}</i>`,
          yesNoKeyboard()
        )

      default:
        break;
    }
  });
  Bot.action(['yes', 'no'], async ctx => {
    const status = ctx.session.status;
    switch (status) {
      case ADD_NEW_EXPENSE_ITEM_ACTION:
        if (ctx.callbackQuery.data === 'yes') {
          const data = {
            name: ctx.session.expenseItemText,
            user_id: ctx.session.user.id,
          }
          const request = await expenseItemsController.addItem(data);
          ctx.editMessageText('Данные успешно добавлены!');
          ctx.session.status = SAVE_EXPENSE_ITEM_SUCCESS_ACTION;
        } else {
          ctx.reply(
            'Чтобы быстро добавить Статью расходов, просто напиши ее и отправь боту',
          );
        }
        break;

      case ADD_COST_ACTION:
        if (ctx.callbackQuery.data === 'yes') {
          const keyboard = await expenseItemKeyboard(ctx.session.user.id);
          ctx.reply(
            'Выберите Статью расходов: ',
            keyboard
          );
          ctx.session.status = ADD_EXPENSE_ITEM_ACTION;
        } else {
          ctx.reply(
            'Чтобы быстро добавить расходы, просто напиши цифру и отправь боту',
          );
        }
        break;

      case ADD_EXPENSE_ITEM_ACTION:
        if (ctx.callbackQuery.data === 'yes') {
          ctx.reply(
            'Выберите дату для расхода: ',
            chooseDateKeyboard()
          );
          ctx.session.status = ADD_DATE_ACTION;
        } else {
          ctx.reply(
            'Выберите Статью расходов: ',
            expenseItemKeyboard(ctx.session.user.id)
          );
          ctx.session.status = ADD_EXPENSE_ITEM_ACTION;
        }
        break;

      case ADD_TODAY_ACTION:
        if (ctx.callbackQuery.data === 'yes') {
          ctx.reply(
            'Чтобы быстро добавить описание, просто отправь его боту'
          );
          ctx.session.status = ADD_DESCRIPTION_ACTION;
        } else {
          ctx.reply(
            'Выберите дату для расхода: ',
            chooseDateKeyboard()
          );
          ctx.session.status = ADD_DATE_ACTION;
        }
        break;

      case ADD_DESCRIPTION_ACTION:
        if (ctx.callbackQuery.data === 'yes') {
          const data = {
            description: ctx.session.description,
            amount: ctx.session.amount,
            user_id: ctx.session.user.id,
            expense_item_id: ctx.session.expenseItem.id,
            timestamp: ctx.session.date,
          }
          const cost = await costController.addCost(data);
          ctx.editMessageText('Расходы успешно добавлены')
          ctx.session.status = CUSSECC_SAVE_COST_ACTION;
        } else {
          ctx.reply(
            'Чтобы быстро добавить описание, просто отправь его боту'
          );
        }
        break;

      case EDIT_EXPENSE_ITEM_ACTION:
        if (ctx.callbackQuery.data === 'yes') {
          const { id } = ctx.session.changeExpenseItem;
          const data = {
            title: ctx.session.changeExpenseItemTitle,
            id,
            userId: ctx.session.user.id
          }
          const expenseItemsArray = await expenseItemsController.setTitle(data);
          ctx.editMessageText('Данные успешно изменены!');
          ctx.session.status = SUCCESS_EDIT_EXPENSE_ITEM_ACTION;
        } else { // *
          ctx.session.status = SHOW_EXPENSE_ITEM;
          const items = await expenseItemsController.getItems(ctx.session.user.id);
          if (items.length > 0) {
            const keyboard = await expenseItemKeyboard(ctx.session.user.id);
            ctx.reply(
              'Список Статей расходов(кликни для редактирования или уаления): ',
              keyboard
            );
            ctx.session.status = CHANGE_EXPENSE_ITEM_ACTION;
          } else {
            ctx.reply('Статей расходов нет...');
          }
        }
        break;

      case DELETE_EXPENSE_ITEM_ACTION:
        if (ctx.callbackQuery.data === 'yes') {
          const data = {
            id: ctx.session.changeExpenseItem.id,
            userId: ctx.session.user.id,
          }
          const del = await expenseItemsController.deleteItem(data);
          ctx.editMessageText('Статья успешно удалена')
          ctx.session.status = SUCCESS_DELETE_EXPENSE_ITEM_ACTION;
        } else { // *
          ctx.session.status = SHOW_EXPENSE_ITEM;
          const items = await expenseItemsController.getItems(ctx.session.user.id);
          if (items.length > 0) {
            const keyboard = await expenseItemKeyboard(ctx.session.user.id);
            ctx.reply(
              'Список Статей расходов(кликни для редактирования или уаления): ',
              keyboard
            );
            ctx.session.status = CHANGE_EXPENSE_ITEM_ACTION;
          } else {
            ctx.reply('Статей расходов нет...');
          }
        }
        break;

      default:
        break;
    }
  });

  Bot.action([ADD_COST_TODAY, ADD_COST_OTHER_DAY], async ctx => {
    const status = ctx.session.status;
    if (status === ADD_DATE_ACTION) {
      if (ctx.callbackQuery.data === ADD_COST_TODAY) {
        const date = new Date();
        ctx.session.date = date.getTime();
        ctx.replyWithHTML(
          `Вы действительно хотите добавить расходы за:\n\n`+
          `<i>${date.getDate()}.${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}.${date.getFullYear()}</i>`,
          yesNoKeyboard()
        );
        ctx.session.status = ADD_TODAY_ACTION;
      }
      if (ctx.callbackQuery.data === ADD_COST_OTHER_DAY) {
        ctx.reply(
          'Введите дату расхода в формате: ДД.ММ.ГГГГ'
        );
        ctx.session.status = ADD_OTHER_DAY_ACTION;
      }
    }
  });

  Bot.action(async (ctx) => { // перечень статей расхода
    const array = ctx.split('/');
    const items = await expenseItemsController.getItems(+array[2]);
    return items.map(item => `expenseItem/${item.id}`)
  }, async ctx => {
    const status = ctx.session.status;
    if (status === ADD_EXPENSE_ITEM_ACTION) {
      const string = ctx.callbackQuery.data;
      const subStringArray = string.split('/');
      ctx.session.expenseItem = {
        id: +subStringArray[1],
        name: null,
        userId: +subStringArray[2]
      };

      const expenseItemsArray = await expenseItemsController.getItems(ctx.session.user.id);
      ctx.session.expenseItem.name = expenseItemsArray.find(item => +item.id === +ctx.session.expenseItem.id).name;

      ctx.replyWithHTML(
        `Вы действительно хотите добавить расходы к статье:\n\n`+
        `<i>${ctx.session.expenseItem.name}</i>`,
        yesNoKeyboard()
      )
    }
    if (status === CHANGE_EXPENSE_ITEM_ACTION) {
      const string = ctx.callbackQuery.data;
      const subStringArray = string.split('/');
      ctx.session.changeExpenseItem = {
        id: +subStringArray[1],
        name: null,
        slug: subStringArray[0],
        userId: +subStringArray[2]
      };
      const expenseItemsArray = await expenseItemsController.getItems(ctx.session.user.id);
      ctx.session.changeExpenseItem.name = expenseItemsArray.find(item => +item.id === +ctx.session.changeExpenseItem.id).name;
      ctx.replyWithHTML(
        `Что сделать со Статьей расходов: ${ctx.session.changeExpenseItem.name}\n\n`,
        EditKeyboard()
        // EditKeyboard({
        //   id: ctx.session.changeExpenseItem.id,
        //   slug: ctx.session.changeExpenseItem.slug,
        // })
      );
      ctx.session.status = EDIT_OR_DELETE_EXPENSE_ITEM_ACTION;
    }
  });

  Bot.launch();
}

// module.exports = { BotModule }