import * as edgedb from "edgedb"

const client = edgedb.createClient()

async function main() {
  await client.execute(
    `
    insert Address { country := "South Africa", townOrCity := "Johannesburg", addressCode := "2191", nameOrNumber := "10 Soho Ln"};
    insert Address { country := "South Africa", townOrCity := "Cape Town", addressCode := "9100", nameOrNumber := "39 Bree Str"};
  `,
  )
}

main()
