namespace Moysklad.Check {
  const UUID_REGEX = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/

  export const isString = (str: any): str is string =>
    typeof str === 'string' && str !== ''

  export const isUrl = (url: any): url is Url =>
    isString(url) && url.substring(0, 8) === 'https://'

  export const isPathStr = (path: any): path is PathStr =>
    isString(path) && !isUrl(path)

  export const isPathArr = (path: any): path is PathArr =>
    path instanceof Array && path.every(isString) && !isUrl(path[0])

  export const isPath = (path: any): path is Path =>
    isPathStr(path) || isPathArr(path)

  export const isUuid = (uuid: any): uuid is Uuid =>
    typeof uuid === 'string' && UUID_REGEX.test(uuid)

  export function isRef(val: any): val is string {
    if (!isPathStr(val)) return false
    const path = val.split(/\//).filter(p => p)
    return path.length > 2 && path[0] === 'entity' && isUuid(path.pop())
  }

  export const isEntityRef = (val: any): val is MoyskladEntityRef =>
    isPlainObject(val) && isString(val.meta?.type) && isUrl(val.meta.href)

  export const isEntity = (val: any): val is MoyskladEntity =>
    isEntityRef(val) && isUuid((val as any).id)

  export const isPlainObject = (val: any): val is { [key: string]: any } => {
    return Object.prototype.toString.call(val) === '[object Object]'
  }

  export const isSimpleValue = (val: any): val is SimpleValue | null => {
    return typeof val !== 'object' || val instanceof Date || val === null
  }

  export const isRedirectResponse = (
    response: GoogleAppsScript.URL_Fetch.HTTPResponse
  ) => {
    const respCode = response.getResponseCode()
    return respCode >= 300 && respCode < 400
  }

  export const isOkResponse = (
    response: GoogleAppsScript.URL_Fetch.HTTPResponse
  ) => {
    const respCode = response.getResponseCode()
    return respCode >= 200 && respCode < 300
  }
}
