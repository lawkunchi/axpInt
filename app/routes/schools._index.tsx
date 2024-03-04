import type { LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData, Link } from "@remix-run/react"
import SchoolListItem from "../components/SchoolListItem"
import { db, client } from "../utils/db.server"

export async function loader({ request }: LoaderFunctionArgs) {
  const query = db.select(db.School, () => ({
    id: true,
    name: true,
    address: {
      id: true,
      nameOrNumber: true,
      street: true,
      street2: true,
      townOrCity: true,
      region: true,
      addressCode: true,
      country: true,
    },
  }))
  return json({
    schools: await query.run(client),
  })
}

export default function Schools() {
  const { schools } = useLoaderData<typeof loader>()
  return (
    <div className="mx-auto w-3/5 p-3">
      <h1>List of schools</h1>
      <Link
        to="/schools/new"
        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Add New School
      </Link>
      {schools.map((school: any) => (
        <SchoolListItem
          key={school.id}
          name={school.name}
          address={`${school.address.townOrCity}, ${school.address.country}`} // Format the address as a string
        />
      ))}
    </div>
  )
}
