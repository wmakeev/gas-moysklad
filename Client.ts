namespace Moysklad {
  export interface MoyskladEntityRef {
    meta: {
      type: string
      href: string
    }
  }

  export interface MoyskladEntity extends MoyskladEntityRef {
    id: string
    name: string
  }

  export interface MoyskladEntityAttribute<T = any> extends MoyskladEntity {
    type: string
    value: T
  }

  export interface MoyskladErrorInfo {
    error: string
    code: number
    moreInfo: string
    line?: number
    column?: number
  }

  export interface ParsedUrl {
    endpoint: string
    api: string
    apiVersion: string
    path: string[]
    query: Query
  }

  export type SimpleValue = string | number | boolean | Date

  export type Uuid = string

  export type Url = string

  export type PathStr = string

  export type PathArr = string[]

  export type Path = string | string[]

  export interface MoyskladAuth {
    login?: string | null
    password?: string | null
    token?: string | null
  }

  /**
   * Параметры инициализации экземпляра клиента
   */
  export interface InstanceOptions extends MoyskladAuth {
    /**
     * Точка досупа к API
     *
     * по умолчанию `https://online.moysklad.ru/api`
     */
    endpoint?: string

    /**
     * Раздел API
     *
     * по умолчанию `remap`
     */
    api?: string

    /**
     * Версия API
     *
     * по умолчанию `1.1`
     */
    apiVersion?: string

    /**
     * Токен для доступа к API
     *
     * Можно передать через глобальную переменную или переменную окружения `MOYSKLAD_TOKEN`
     * (см. [Аутентификация](https://github.com/wmakeev/moysklad#аутентификация))
     */
    token?: string | null

    /**
     * Логин
     *
     * Можно передать через глобальную переменную или переменную окружения `MOYSKLAD_LOGIN`
     * (см. [Аутентификация](https://github.com/wmakeev/moysklad#аутентификация))
     */
    login?: string | null

    /**
     * Пароль
     *
     * Можно передать через глобальную переменную или переменную окружения `MOYSKLAD_PASSWORD`
     * (см. [Аутентификация](https://github.com/wmakeev/moysklad#аутентификация))
     */
    password?: string | null

    eventHandler?: (event: string, params: object) => void
  }

  export type QueryValue = SimpleValue // string | number | boolean | Date

  export interface QueryObject {
    /**
     * Равно `key=value`
     */
    $eq?: QueryValue

    /**
     * Не равно `key!=value`
     */
    $ne?: QueryValue

    /**
     * Больше `key>value`
     */
    $gt?: QueryValue

    /**
     * Больше или равно `key>=value`
     */
    $gte?: QueryValue

    /**
     * Меньше `key<value`
     */
    $lt?: QueryValue

    /**
     * Меньше или равно `key<=value`
     */
    $lte?: QueryValue

    /**
     * Начинается со строки `key~=value`
     */
    $st?: QueryValue

    /**
     * Заканчивается строкой `key=~value`
     */
    $et?: QueryValue

    /**
     * Содержит строку `key~value`
     */
    $contains?: QueryValue

    /**
     * Входит в `key=value1;key=value2;...`
     */
    $in?: QueryValue[]

    /**
     * Не входит `key!=value1;key!=value2;...`
     */
    $nin?: QueryValue[]

    /**
     * Наличие значения (не null)
     *
     * true - `key!=`
     * false - `key=`
     */
    $exists?: boolean

    /**
     * Объединение нескольких условий
     */
    $and?: QueryObject[]

    /**
     * Отрицание условия
     */
    $not?: QueryObject

    /**
     * Равно `key=value`
     */
    [key: string]:
      | QueryValue
      | QueryValue[]
      | QueryObject
      | QueryObject[]
      | undefined
  }

  export type QueryFilter = {
    [key: string]: QueryValue | QueryValue[] | QueryObject
  }

  export type QueryOrder = Array<string | [string] | [string, string]>

  /**
   * Параметры запроса
   *
   * Все поля объекта преобразуются в соответствующую строку запроса url. Некоторые поля (поле `filter`) подвергаются преобразованию.
   */
  export interface Query {
    /**
     * Используется для фильтрации элементов коллекции
     *
     * ```js
     * const filter = {
     *    applicale: true,
     *    moment: {
     *      $gt: '2019-08-10 11:00'
     *    }
     * }
     * ```
     */
    filter?: QueryFilter | string

    /** TODO */
    search?: string

    /**
     * Используется для раскрытия ссылок на связанные объекты
     *
     * Пример: `agent,positions.assortment`
     *
     * Если указан `expand` и не указан `limit`, то `limit` будет автоматически установлен как `100`
     */
    expand?: string

    /**
     * Задает ограничение на кол-во возвращаемых элементов в коллекции
     *
     * Если указан `expand` и не указан `limit`, то `limit` будет автоматически установлен как `100`
     */
    limit?: number

    /** Задает смещение для первого элемента в коллекции */
    offset?: number

    /**
     * Сортировка выборки
     *
     * Примеры:
     * - `name` или `['name']`
     * - `code,desc` или `[['code','desc']]`
     * - `name;code,desc` или `['name', ['code','desc']]`
     * - `name,desc;code,asc` или `['name,desc', ['code','asc']]`
     */
    order?: QueryOrder | string

    [key: string]: any
  }

  export type FetchMethod = 'get' | 'delete' | 'patch' | 'post' | 'put'

  /**
   * Все опции переданные в объекте `options` (за исключением вспомогательных) передаются напрямую в опции метода `fetch` ([Fetch API](http://github.github.io/fetch/)) при осуществлении запроса.
   */
  export interface RequestOptions {
    rawResponse?: boolean

    /**
     * Если `true`, то в запрос будет включен заголовок `X-Lognex-Format-Millisecond` со значением `true` (все даты объекта будут возвращены с учетом миллисекунд).
     */
    millisecond?: boolean

    /**
     * Если `true`, то в запрос будет включен заголовок `X-Lognex-Precision` со значением `true` (отключение округления цен и себестоимости до копеек).
     */
    precision?: boolean

    /**
     * Если `true`, то в запрос будет включен заголовок `X-Lognex-WebHook-Disable` со значением `true` (отключить уведомления вебхуков в контексте данного запроса).
     */
    webHookDisable?: boolean

    /**
     * Можно добавить дополнительные заголовки запроса
     */
    headers?: {
      [header: string]: string | number
    }

    /**
     * Если `true`, то все ошибки будут проигнорированы (метод не будет генерировать ошибку если код ответа сервера не в диапазоне 200-299 и/или тело ответа содержит описание ошибки МойСклад).
     * Ошибка вернется как результат ввиде объекта.
     *
     * Пример:
     * ```js
     * const result = await ms.GET('foo', null, { muteErrors: true })
     *
     * if (result.errors) {
     *  console.log(result.errors[0].error)
     * }
     * ```
     */
    muteErrors?: boolean

    /**
     * Обработка редиректа
     *
     * Установите `follow`, если нужно автоматически обрабатывать редирект `3xx`.
     * Например при запросе товара по Id из приложения МойСклад
     *
     * default: `manual`
     */
    redirect?: 'follow' | 'follow-clear' | 'manual' | 'error'

    // [option: string]: any
  }

  export interface Request<T = any> {
    path: Path
    method?: FetchMethod
    query?: Query | null
    payload?: T
    options?: RequestOptions
  }

  export class Client {
    private options: InstanceOptions

    constructor(options?: InstanceOptions) {
      this.options = Object.assign(
        {
          endpoint: 'https://online.moysklad.ru/api',
          api: 'remap'
        },
        options
      )

      if (!this.options.apiVersion) {
        const apiVersion = Methods.getApiDefaultVersion(this.options.api)
        if (apiVersion) {
          this.options.apiVersion = apiVersion
        } else {
          throw new Errors.MoyskladError(
            `Не указана версия ${this.options.api} API`
          )
        }
      }
    }

    getOptions() {
      return this.options
    }

    getAuthHeader() {
      return Methods.getAuthHeader(this.getOptions())
    }

    buildUrl(path: Path, query?: Query | null) {
      return Methods.buildUrl(this, path, query)
    }

    parseUrl(path: Path) {
      return Methods.parseUrl(this, path)
    }

    fetch<T = any>(
      request: Request & {
        options: {
          rawResponse: true
        }
      }
    ): GoogleAppsScript.URL_Fetch.HTTPResponse

    fetch<T = any>(request: Request): T

    fetch(request: Request) {
      return this.fetchBatch([request])[0]
    }

    fetchBatch(requests: Request[]) {
      return Methods.fetchBatch(this, requests)
    }

    GET<R = any>(
      path: string | string[],
      query?: Query | null,
      options?: RequestOptions
    ) {
      return this.fetch<R>({
        path,
        method: 'get',
        query,
        options
      })
    }

    POST<R = any, T = any>(
      path: string | string[],
      payload: T,
      query?: Query | null,
      options?: RequestOptions
    ) {
      return this.fetch<R>({
        path,
        method: 'post',
        query,
        payload,
        options
      })
    }

    PUT<R = any, T = any>(
      path: string | string[],
      payload: T,
      query?: Query | null,
      options?: RequestOptions
    ) {
      return this.fetch<R>({
        path,
        method: 'put',
        query,
        payload,
        options
      })
    }

    DELETE(path: string | string[], options?: RequestOptions) {
      return this.fetch({
        path,
        method: 'post',
        options
      })
    }
  }
}
