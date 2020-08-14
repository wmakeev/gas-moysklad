namespace Moysklad.Methods {
  // https://regex101.com/r/yQgvn4/4
  const URL_REGEX = /^(https:\/\/.+\/api)\/(.+)\/(\d+\.\d+)\/([^?]+)(?:\?(.+))?$/

  export function parseUrl(instance: Client, path: Path) {
    let { endpoint, api, apiVersion } = instance.getOptions()

    let pathStr = ''
    let queryStr = ''

    if (Check.isUrl(path)) {
      const [, endpoint_, api_, version_, path_, query_] =
        URL_REGEX.exec(path) || []
      endpoint = endpoint_
      api = api_
      pathStr = path_
      apiVersion = version_
      queryStr = query_
    } else if (Check.isPathArr(path)) {
      pathStr = path.join('/')
    } else if (Check.isPathStr(path)) {
      pathStr = path
    } else {
      throw new Errors.MoyskladArgumentError(path, 'url')
    }

    if (!endpoint || !api || !apiVersion || !pathStr) {
      throw new Errors.MoyskladArgumentError(
        path,
        'url',
        'не соответсвует API МойСклад'
      )
    }

    return {
      endpoint,
      api,
      apiVersion,
      path: normalizeUrl(pathStr).split(/\//g),
      query: parseQueryString(queryStr) || {}
    } as ParsedUrl
  }
}
