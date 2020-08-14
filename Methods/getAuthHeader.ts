namespace Moysklad.Methods {
  const bearerAuth = (token: string) => `Bearer ${token}`

  const basicAuth = (login: string, password: string) =>
    'Basic ' + Tools.base64encode(`${login}:${password}`)

  export function getAuthHeader(options: InstanceOptions) {
    let token: string | null = null
    let login: string | null = null
    let password: string | null = null

    switch (true) {
      case options.token != null:
        token = options.token!
        break

      case options.login != null:
        login = options.login!
        password = options.password!
        break

      // case Tools.getUserProp('MOYSKLAD_TOKEN') != null:
      //   token = Tools.getUserProp('MOYSKLAD_TOKEN')!
      //   break

      // case Tools.getUserProp('MOYSKLAD_LOGIN') != null:
      //   login = Tools.getUserProp('MOYSKLAD_LOGIN')!
      //   password = Tools.getUserProp('MOYSKLAD_PASSWORD')!
      //   break

      default:
        return undefined
    }

    if (token) {
      return bearerAuth(token)
    } else if (login && password) {
      return basicAuth(login, password)
    } else {
      throw new Errors.MoyskladError('Не указан пароль для доступа к API')
    }
  }
}
