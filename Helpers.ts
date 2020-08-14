namespace Moysklad.Helpers {
  const { isPath, isEntityRef } = Moysklad.Check

  type AnyRef =
    | Moysklad.MoyskladEntity
    | Moysklad.MoyskladEntityRef
    | Moysklad.Path

  function getShortHrefMetaType(shortHref: string) {
    switch (true) {
      case shortHref.indexOf('entity/customentity') === 0:
        return 'customentity'

      case shortHref.indexOf('metadata/attributes') !== -1:
        return 'attributemetadata'

      case shortHref.indexOf('metadata/states') !== -1:
        return 'state'

      case shortHref.indexOf(
        'context/companysettings/metadata/customEntities'
      ) === 0:
        return 'customentitymetadata'

      case shortHref.indexOf('context/companysettings/pricetype') === 0:
        return 'pricetype'

      default:
        const parts = shortHref.split('/')
        if (parts[0] === 'entity' && parts[1]) {
          if (parts[3] === 'positions') {
            return `${parts[1]}position`
          } else {
            return parts[1]
          }
        }
        throw new Error('Неизвестный тип сокращенного href - ' + shortHref)
    }
  }

  export function helpers(ms: Moysklad.Client) {
    /**
     * Возвращает href для некого пути
     *
     * ```ts
     * href('')
     * ```
     */
    const href = (anyRef: AnyRef) => {
      if (isPath(anyRef)) {
        return ms.buildUrl(anyRef)
      } else if (isEntityRef(anyRef)) {
        return ms.buildUrl(anyRef.meta.href)
      } else {
        throw new Errors.MoyskladArgumentError(
          anyRef,
          'anyRef',
          'ссылка на объект'
        )
      }
    }

    const getStrPath = (anyRef: AnyRef) => {
      if (isPath(anyRef)) {
        return ms.parseUrl(anyRef).path.join('/')
      } else if (isEntityRef(anyRef)) {
        return ms.parseUrl(anyRef.meta.href).path.join('/')
      } else {
        throw new Errors.MoyskladArgumentError(
          anyRef,
          'anyRef',
          'ссылка на объект'
        )
      }
    }

    const meta = (path: AnyRef) => ({
      type: getShortHrefMetaType(getStrPath(path)),
      href: href(path)
    })

    const attr = <T>(path: Path, value: T) => {
      if (getShortHrefMetaType(getStrPath(path)) !== 'attributemetadata') {
        throw new Error('attr: Href не соответствует типу атрибута')
      }

      return {
        meta: {
          type: 'attributemetadata',
          href: href(path)
        },
        value
      }
    }

    const ref = (anyRef: AnyRef, value = {}) =>
      Object.assign({}, value, { meta: meta(anyRef) })

    const positionRef = (docPath: Path, posId: string, value = {}) => {
      if (docPath instanceof Array) {
        return ref([...docPath, 'positions', posId], value)
      } else {
        return ref([docPath, 'positions', posId], value)
      }
    }

    const refEqual = (refEntity1: AnyRef, refEntity2: AnyRef) => {
      const ref1 = refEntity1 ? href(refEntity1) : null

      if (ref1 == null) return false

      const ref2 = refEntity2 ? href(refEntity2) : null

      if (ref2 == null) return false

      return ref1 === ref2
    }

    return {
      href,
      attr,
      meta,
      ref,
      positionRef,
      refEqual
    }
  }
}
