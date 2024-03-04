import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import {
  Form,
  useActionData,
  useNavigation,
  useLoaderData,
} from "@remix-run/react"

import { db, client } from "../utils/db.server"

import * as Yup from "yup"

// Define validation schema
const schema = Yup.object().shape({
  name: Yup.string().required("School name is required"),
  nameOrNumber: Yup.string().required("nameOrNumber is required"),
  townOrCity: Yup.string().required("townOrCity is required"),
  addressCode: Yup.string().required("addressCode is required"),
  country: Yup.string().required("country is required"),
})

export const meta: MetaFunction = () => [{ title: "Schools" }]

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData()

  const newSchool = {
    name: body.get("name"),
    nameOrNumber: body.get("nameOrNumber"),
    townOrCity: body.get("townOrCity"),
    addressCode: body.get("addressCode"),
    country: body.get("country"),
  }

  try {
    await schema.validate(newSchool)

    // First, insert the school
    const school = await db
      .insert(db.School, {
        name: newSchool.name,
      })
      .run(client)

    const newAddress = await db
      .insert(db.Address, {
        nameOrNumber: newSchool.nameOrNumber || "", // Assign an empty string if the value is null
        townOrCity: newSchool.townOrCity,
        addressCode: newSchool.addressCode,
        country: newSchool.country,
        organisation: db.select(db.Organisation, () => ({
          id: true,
          name: true,
          filter_single: { id: school.id },
        })),
      })
      .run(client)

    return redirect(`/schools/`)
  } catch (error: any) {
    if (error.errors) {
      return json({ error: error.errors[0] }, { status: 400 })
    } else {
      // Handle other types of errors
      return json({ error: error.message }, { status: 500 })
    }
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const query = db.select(db.Address, () => ({
    id: true,
    townOrCity: true,
    country: true,
  }))
  return json({
    addresses: await query.run(client),
  })
}

export default function NewSchool() {
  const errors = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.formAction === "/schools/new"
  const { addresses } = useLoaderData<typeof loader>()
  return (
    <div className="mx-auto w-3/5 p-3">
      <Form method="post" className="space-y-4">
        {errors && errors.error && (
          <p className="mt-2 text-sm text-red-600">{errors.error}</p>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            School Name:
          </label>
          <input
            name="name"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            School Name:
          </label>
          <input
            name="name"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            School Name:
          </label>
          <input
            name="name"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            School Name:
          </label>
          <input
            name="name"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address:
          </label>
          <select
            id="address"
            name="address"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            {addresses.map((address: any) => (
              <option key={address.id} value={address.id}>
                {address.townOrCity}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isSubmitting ? "Saving..." : "Create Recipe"}
        </button>
      </Form>
    </div>
  )
}
