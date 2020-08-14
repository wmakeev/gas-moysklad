namespace Moysklad.Methods {
  const DEFAULT_VERSIONS = {
    remap: '1.2',
    phone: '1.0',
    posap: '1.0',
    'moysklad/loyalty': '1.0'
  } as { [api: string]: string }

  // const ENV_KEY_ = {
  //   remap: 'REMAP',
  //   phone: 'PHONE',
  //   posap: 'POSAP',
  //   'moysklad/loyalty': 'LOYALTY'
  // } as { [api: string]: string }

  export function getApiDefaultVersion(api: string | null | undefined) {
    if (!api) return null

    const apiVersion = DEFAULT_VERSIONS[api]

    // TODO Передавать общий метод для получения env переменных и метод по-умолчанию
    //const envKey = ENV_KEY_[api] || api.replace(/\W/g, '_').toUpperCase()
    // const envName = `MOYSKLAD_${envKey}_API_VERSION`

    return apiVersion
  }
}
