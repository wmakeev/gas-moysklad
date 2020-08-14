namespace Moysklad.Methods {
  const isPlainObject = Check.isPlainObject

  const addQueryPart = (res: Array<[string, string]>, key: string) => (
    val: any
  ): void => {
    if (val === null) {
      res.push([key, ''])
    } else if (val === undefined) {
      return
    } else if (['string', 'number', 'boolean'].indexOf(typeof val) === -1) {
      throw new TypeError(
        'url query key value must to be string, number, boolean, null or undefined'
      )
    } else {
      res.push([key, encodeURIComponent(val)])
    }
  }

  export function buildQuery(query: Query): string {
    // совместимость с remap 1.2
    if (query.expand && query.limit == null) {
      query.limit = 100
    }

    return Object.keys(query)
      .reduce((res, key) => {
        const addPart = addQueryPart(res, key)

        switch (true) {
          case key === 'filter':
            if (isPlainObject(query.filter)) addPart(buildFilter(query.filter))
            else if (typeof query.filter === 'string') addPart(query.filter)
            else throw new TypeError('query.filter must to be string or object')
            break

          case key === 'order' && query.order instanceof Array:
            addPart(
              (query.order as QueryOrder)
                .map(o =>
                  o instanceof Array
                    ? `${o[0]}${o[1] != null ? ',' + o[1] : ''}`
                    : o
                )
                .join(';')
            )
            break

          case query[key] instanceof Array:
            query[key].forEach(addPart)
            break

          default:
            addPart(query[key])
        }

        return res
      }, [])
      .map(kv => `${kv[0]}=${kv[1]}`)
      .join('&')
  }
}
