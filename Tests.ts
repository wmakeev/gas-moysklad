namespace Moysklad.Tests {
  export function test_01() {
    const ms = new Client()

    const product = ms.GET(
      'entity/product',
      {
        filter: {
          updated: {
            $gt: new Date(2020, 0)
          }
        },
        limit: 1
      },
      {
        rawResponse: true
      }
    ).rows[0]

    Logger.log(product.name)
  }
}
