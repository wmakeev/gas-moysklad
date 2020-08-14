namespace Moysklad.Methods {
  function translateRequest(
    instance: Client,
    request: Request,
    authHeader: string
  ) {
    const urlFetchRequest: GoogleAppsScript.URL_Fetch.URLFetchRequest = {
      url: instance.buildUrl(request.path, request.query),
      method: request.method || 'get',
      contentType: 'application/json',
      payload: request.payload ? JSON.stringify(request.payload) : undefined,
      followRedirects: request.options?.redirect === 'follow',
      headers: Object.keys(request.options?.headers ?? {}).reduce(
        (res, h) => {
          res[h] = String(request.options!.headers![h])
          return res
        },
        {
          Authorization: authHeader
        } as GoogleAppsScript.URL_Fetch.HttpHeaders
      ),
      muteHttpExceptions: true
    }

    // X-Lognex
    if (request.options?.millisecond) {
      urlFetchRequest.headers!['X-Lognex-Format-Millisecond'] = 'true'
    }

    if (request.options?.precision) {
      urlFetchRequest.headers!['X-Lognex-Precision'] = 'true'
    }

    if (request.options?.webHookDisable) {
      urlFetchRequest.headers!['X-Lognex-WebHook-Disable'] = 'true'
    }

    return urlFetchRequest
  }

  export function getResponseBodyValue<T = any>(
    response: GoogleAppsScript.URL_Fetch.HTTPResponse
  ) {
    const headers = response.getAllHeaders() as { [header: string]: string }

    const isJson = headers?.['Content-Type']?.includes('application/json')

    const contentText = response.getContentText()

    return isJson && contentText ? (JSON.parse(contentText) as T) : undefined
  }

  /**
   * Выполнить список запросов
   * @param instance Экземпляр клиента МойСклад
   * @param requests Запросы
   */
  export function fetchBatch(
    instance: Client,
    requests: Request[]
  ): Array<GoogleAppsScript.URL_Fetch.HTTPResponse | object | undefined> {
    const authHeader = instance.getAuthHeader()
    const eventHandler = instance.getOptions().eventHandler

    if (!authHeader) {
      throw new Errors.MoyskladError('Параметры авторизации не указаны')
    }

    const urlFetchRequests = requests.map(request =>
      translateRequest(instance, request, authHeader)
    )

    if (eventHandler)
      urlFetchRequests.forEach((request, index) => {
        eventHandler('request', {
          url: request.url,
          options: requests[index].options,
          request
        })
      })

    const responses = UrlFetchApp.fetchAll(urlFetchRequests).map(
      (response, index) => {
        const request = requests[index]
        const fetchRequest = urlFetchRequests[index]

        const isOk = Check.isOkResponse(response)
        const isRedirect = Check.isRedirectResponse(response)
        const redirectType = request.options?.redirect
        const muteErrors = request.options?.muteErrors ?? false
        const rawResponse = request.options?.rawResponse ?? false

        if (eventHandler)
          eventHandler('response', {
            url: fetchRequest.url,
            options: request.options,
            request: fetchRequest,
            response: response
          })

        if (isRedirect) {
          switch (redirectType) {
            case 'follow':
              // обрабатывается автоматически при запросе UrlFetch
              throw new Errors.MoyskladError(
                'Получен необработанный редирект с опцией redirect=follow'
              )

            case 'error':
              throw new Errors.MoyskladRequestError(
                'Редиректы запрещены (options.redirect = "error")',
                fetchRequest,
                response
              )

            // Сдедование редиректу без сохранения настроек (заголовки, авторизация)
            case 'follow-clear': {
              const location = (response.getAllHeaders() as any)
                .Location as string

              if (!location) {
                throw new Errors.MoyskladRequestError(
                  'Заголовок "Location" в ответе сервера пуст',
                  fetchRequest,
                  response
                )
              }

              // TODO все редиректы обрабатывать аналогично через batch запрос
              return fetchBatch(instance, [
                {
                  path: location,
                  method: 'get',
                  options: {
                    muteErrors: request.options?.muteErrors ?? false
                  }
                }
              ])[0]
            }

            case 'manual':
              break

            default:
              throw new Errors.MoyskladArgumentError(
                redirectType,
                'options.redirect'
              )
          }
        }

        /** Отложенная ошибка (отдаем приоритет для ошибки из тела ответа) */
        let responseError =
          !isOk && !isRedirect // isRedirect === true в случае с `manual`
            ? new Errors.MoyskladRequestError(
                `Ошибка запроса ${response.getResponseCode()}`,
                fetchRequest,
                response
              )
            : null

        const responseBodyValue = getResponseBodyValue<object>(response)

        if (responseBodyValue)
          responseError =
            getResponseError(responseBodyValue, fetchRequest, response) ??
            responseError

        if (responseError && !muteErrors) throw responseError

        return rawResponse ? response : responseBodyValue
      }
    )

    return responses
  }
}
