namespace Moysklad.Tools {
  const { isUuid, isEntity, isEntityRef, isPathStr, isPathArr, isUrl } = Check

  export function base64encode(val: string) {
    return Utilities.base64Encode(val)
  }

  export function getId(
    val: Url | Path | MoyskladEntityRef | MoyskladEntity
  ): string | null {
    if (isUrl(val) || isPathStr(val)) {
      const id = val
        .split(/\//)
        .filter(it => it)
        .pop()
      return isUuid(id) ? id : null
    } else if (isPathArr(val)) {
      const id = val[val.length - 1]
      return isUuid(id) ? id : null
    } else if (isEntity(val)) {
      return val.id
    } else if (isEntityRef(val)) {
      return getId(val.meta.href)
    } else {
      return null
    }
  }

  export function getAttr<T = any>(
    entity: { attributes?: Array<MoyskladEntityAttribute<T>> },
    key: Url | Path | MoyskladEntityRef | MoyskladEntity
  ) {
    if (!entity.attributes) return null

    const id = getId(key)

    if (!id) {
      throw new Errors.MoyskladArgumentError(
        key,
        'key',
        `ключ для поиска атрибута не содержит идентификатор`
      )
    }

    const attr = entity.attributes.find(attr => getId(attr) === id) ?? null

    return attr
  }
}
