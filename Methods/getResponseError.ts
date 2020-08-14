namespace Moysklad.Methods {
  export function getResponseError(
    parsedBody: any,
    request: GoogleAppsScript.URL_Fetch.URLFetchRequest,
    response: GoogleAppsScript.URL_Fetch.HTTPResponse
  ) {
    let errors: MoyskladErrorInfo[] = []

    if (!parsedBody) return null

    if (parsedBody instanceof Array) {
      errors = parsedBody
        .filter(item => item.errors)
        .map(errItem => errItem.errors)
        .reduce((res, errors) => res.concat(errors), [])
    } else if (parsedBody.errors) {
      errors = parsedBody.errors
    }

    return errors && errors.length
      ? new Errors.MoyskladApiError(errors, request, response)
      : null
  }
}
