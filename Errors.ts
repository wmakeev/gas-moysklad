namespace Moysklad.Errors {
  export class MoyskladError extends Error {
    constructor(message: string) {
      super(message)
      this.name = this.constructor.name
    }
  }

  export class MoyskladArgumentError extends MoyskladError {
    constructor(arg: any, argName: string, info?: string) {
      const argVal = JSON.stringify(arg)?.substr(0, 100)
      super(
        `Некорректный аргумент ${argName}${
          info ? ` (${info})` : ''
        } - ${argVal}`
      )
    }
  }

  export class MoyskladRequestError extends MoyskladError {
    public url: string
    public status: number
    public statusText: string | null
    public request: GoogleAppsScript.URL_Fetch.URLFetchRequest
    public response: GoogleAppsScript.URL_Fetch.HTTPResponse

    constructor(
      message: string,
      request: GoogleAppsScript.URL_Fetch.URLFetchRequest,
      response: GoogleAppsScript.URL_Fetch.HTTPResponse
    ) {
      super(message)

      this.url = request.url
      this.status = response.getResponseCode()
      this.statusText = null
      this.request = request
      this.response = response
    }
  }

  export class MoyskladApiError extends MoyskladRequestError
    implements MoyskladErrorInfo {
    public error: string
    public code: number
    public moreInfo: string
    public line?: number
    public column?: number
    public errors: MoyskladErrorInfo[]

    constructor(
      errors: MoyskladErrorInfo[],
      request: GoogleAppsScript.URL_Fetch.URLFetchRequest,
      response: GoogleAppsScript.URL_Fetch.HTTPResponse
    ) {
      const error = errors[0]
      const message = error.error || 'Неизвестная ошибка API МойСклад'

      super(message, request, response)

      this.error = error.error
      this.code = error.code
      this.moreInfo = error.moreInfo
      if (error.line != null) this.line = error.line
      if (error.column != null) this.column = error.column
      this.errors = errors
    }
  }
}
