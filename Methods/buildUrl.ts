namespace Moysklad.Methods {
  export function buildUrl(
    instance: Client,
    path: Url | Path,
    query?: Query | null
  ) {
    let resultPath: PathArr
    let resultQuery: Query | null | undefined

    const { endpoint, api, apiVersion } = instance.getOptions()

    if (Check.isUrl(path)) {
      const parsedUrl = parseUrl(instance, path)

      resultPath = parsedUrl.path

      resultQuery = {
        ...parsedUrl.query,
        ...query
      }
    } else if (Check.isPath(path)) {
      resultPath = normalizePath(path)
      resultQuery = query
    } else {
      throw new Errors.MoyskladArgumentError(path, 'path')
    }

    let resultUrl = normalizeUrl(
      [endpoint, api, apiVersion].concat(resultPath).join('/')
    )

    if (resultQuery) {
      const queryString = buildQuery(resultQuery)
      resultUrl = resultUrl + (queryString ? `?${queryString}` : '')
    }

    return resultUrl
  }
}
