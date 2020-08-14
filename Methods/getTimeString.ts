namespace Moysklad.Methods {
  const MSK_TIMEZONE_OFFSET_ = 180 * 60 * 1000

  /**
   * Возвращает дату для фильтра в часовом поясе Москвы
   * @param {Date} date Конвертируемая дата
   * @param {boolean} includeMs Отображать миллисекунды
   * @returns {string} Дата ввиде строки
   */
  export function getTimeString(date: Date) {
    const mskTime = new Date(+date + MSK_TIMEZONE_OFFSET_)

    const includeMs = date.getUTCMilliseconds() !== 0

    return mskTime
      .toJSON()
      .replace('T', ' ')
      .replace(includeMs ? /Z$/ : /(\.\d{3})?Z$/, '')
  }
}
