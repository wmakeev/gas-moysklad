namespace Moysklad.Methods {
  export function normalizePath(path: Path) {
    return path instanceof Array ? path : [path]
  }
}
