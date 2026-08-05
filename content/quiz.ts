import type { QuizSectionContent } from "./types";
import { ROOMS, TEXTURES } from "./prices";
import { business } from "./business";

/**
 * Конфигурация квиза. Механика — в components/quiz, расчёт — в lib/estimate.
 *
 * Варианты шагов 1 и 3 собираются из content/prices.ts, поэтому цифры и
 * пояснения фактур гарантированно совпадают с таблицей цен.
 */

const MIN_NAME_LENGTH = 2;

export const quiz = {
  id: "quiz",
  eyebrow: "Расчёт за минуту",
  title: "Ответьте на три вопроса — покажем стоимость",
  subtitle:
    "Расчёт появится на экране сразу, до того как вы оставите телефон. " +
    "Замерщик потом уточнит цифру на месте и зафиксирует её в договоре.",

  config: {
    id: "quiz",

    steps: [
      {
        kind: "choice",
        id: "room",
        title: "Куда ставим потолок?",
        hint: "От помещения зависит профиль и работа с углами",
        autoAdvance: true,
        requiredMessage: "Выберите помещение",
        options: ROOMS.map((room) => ({
          id: room.id,
          label: room.label,
          note: room.note,
          icon: room.icon,
        })),
      },

      {
        kind: "number",
        id: "area",
        title: "Сколько примерно квадратов?",
        hint: "Точность до метра не нужна — замерщик пересчитает",
        unit: "м²",
        min: 5,
        max: 200,
        placeholder: "18",
        invalidMessage: "Укажите площадь от 5 до 200 м²",
        presets: [
          { label: "До 15 м²", value: 12 },
          { label: "15–25 м²", value: 20 },
          { label: "Больше 25 м²", value: 35 },
        ],
      },

      {
        kind: "choice",
        id: "texture",
        title: "Какая фактура ближе?",
        hint: "Если не уверены — берите матовую, её выбирают 7 из 10",
        autoAdvance: true,
        requiredMessage: "Выберите фактуру",
        options: TEXTURES.map((texture) => ({
          id: texture.id,
          label: `${texture.label} — ${texture.rate} ₽/м²`,
          note: texture.short,
        })),
      },

      {
        kind: "form",
        id: "contact",
        title: "Куда прислать расчёт?",
        hint: "Позвоним один раз, чтобы уточнить детали и согласовать замер",
        showSummary: true,
        submitLabel: "Записаться на бесплатный замер",
        submittingLabel: "Отправляем…",
        consent:
          "Нажимая кнопку, вы соглашаетесь на обработку персональных данных. " +
          "Рассылок не будет.",
        fields: [
          {
            id: "name",
            label: "Как вас зовут",
            placeholder: "Имя",
            format: "text",
            inputMode: "text",
            autoComplete: "given-name",
            rules: [
              {
                kind: "minLength",
                value: MIN_NAME_LENGTH,
                message: "Напишите имя, чтобы знать, как к вам обращаться",
              },
            ],
          },
          {
            id: "phone",
            label: "Телефон",
            placeholder: "+7 (___) ___-__-__",
            format: "phone",
            inputMode: "tel",
            autoComplete: "tel",
            rules: [
              {
                kind: "phone",
                message: "Проверьте номер: нужно 10 цифр после +7",
              },
            ],
          },
        ],
      },
    ],

    ui: {
      back: "Назад",
      next: "Далее",
      progress: "Шаг {current} из {total}",
      stepAnnouncement: "Шаг {current} из {total}. {title}",
      errorTitle: "Заявка не ушла",
      errorText:
        "Что-то с соединением. Ответы сохранились — попробуйте ещё раз или " +
        `позвоните сами: ${business.phone.display}.`,
      retry: "Отправить ещё раз",
    },

    success: {
      title: "Заявка принята",
      steps: [
        "Перезвоним в течение 15 минут — с 9:00 до 21:00, ночные заявки берём утром",
        "Уточним адрес и подберём удобное время замера, обычно это сегодня или завтра",
        "Замерщик приедет с образцами фактур и посчитает при вас",
      ],
      note: "Если передумаете до замера — просто скажите об этом по телефону.",
    },
  },

  estimate: {
    title: "Примерная стоимость",
    forArea: "за ваши {area} м²",
    included: "Включено: полотно, гарпунный профиль, монтаж и уборка",
    disclaimer:
      "Это предварительный расчёт по средним ставкам. Точную сумму замерщик " +
      "назовёт на месте и впишет в договор — выше она не станет.",
  },
} satisfies QuizSectionContent;
