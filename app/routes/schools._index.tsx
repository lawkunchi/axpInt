import { useState, useEffect } from "react"
import type { LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData, Link, useNavigate } from "@remix-run/react"
import SchoolListItem from "../components/SchoolListItem"
import { db, client } from "../utils/db.server"

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const filter = url.searchParams.get("filter") || ""
  let query = db.select(db.School, (school) => ({
    id: true,
    name: true,
    address: {
      id: true,
      nameOrNumber: true,
      townOrCity: true,
      addressCode: true,
      country: true,
    },
    filter: db.op(
      db.op(school.address.nameOrNumber, "ilike", `%${filter}%`),
      "or",
      db.op(school.address.townOrCity, "ilike", `%${filter}%`),
    ),
  }))

  return json({
    schools: await query.run(client),
  })
}

export default function Schools() {
  const { schools } = useLoaderData<typeof loader>()
  const [filter, setFilter] = useState("")
  const navigate = useNavigate()
  useEffect(() => {
    navigate(`/schools?filter=${filter}`)
  }, [filter, navigate])

  return (
    <div className="mx-auto mt-5 w-3/5 p-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">List of Schools</h1>
        <Link
          to="/schools/new"
          className="ml-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add New School
        </Link>
      </div>
      <div className="p-3">
        <label className="mb-2 mt-3 block text-sm font-medium text-gray-700">
          Filter by address name or city/town
        </label>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by address, town, city or country"
          className="h-10 w-full rounded-md border-gray-300 bg-gray-50 pl-2 text-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      {schools.map((school: any) => (
        <SchoolListItem
          key={school.id}
          name={school.name}
          address={school.address} // Format the address as a string
        />
      ))}
    </div>
  )
}
