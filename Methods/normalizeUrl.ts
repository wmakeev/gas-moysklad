namespace Moysklad.Methods {
  const URI_EXTRA_SLASH_REGEX = /([^:]\/)\/+/g
  const TRIM_SLASH = /^\/+|\/+$/g

  export function normalizeUrl(url: Url) {
    return url.replace(TRIM_SLASH, '').replace(URI_EXTRA_SLASH_REGEX, '$1')
  }
}
