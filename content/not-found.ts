import type { NotFoundContent } from "./types";

/** Тексты 404. Тон тот же, что на лендинге: спокойно и по делу. */
export const business404 = {
  code: "404",
  title: "Такой страницы нет",
  text:
    "Возможно, ссылка устарела или в адресе опечатка. Вернитесь на главную — " +
    "там цены, примеры работ и расчёт стоимости за минуту.",
  homeLabel: "На главную",
} satisfies NotFoundContent;
