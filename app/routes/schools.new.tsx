import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Form, useActionData, useNavigation, Link } from "@remix-run/react"

import { db, client } from "../utils/db.server"

import * as Yup from "yup"

export const meta: MetaFunction = () => [{ title: "Schools" }]

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData()

  const schema = Yup.object().shape({
    name: Yup.string().required("School name is required"),
    nameOrNumber: Yup.string().required("Address Number is required"),
    townOrCity: Yup.string().required("Town or City is required"),
    addressCode: Yup.string().required("Adress code is required"),
    country: Yup.string().required("Country is required"),
  })

  const newSchool = {
    name: body.get("name"),
    nameOrNumber: body.get("nameOrNumber"),
    townOrCity: body.get("townOrCity"),
    addressCode: body.get("addressCode"),
    country: body.get("country"),
  }

  try {
    await schema.validate(newSchool)

    const school = await db
      .insert(db.School, {
        name: newSchool.name,
      })
      .run(client)

    await db
      .insert(db.Address, {
        nameOrNumber: newSchool.nameOrNumber,
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

export default function NewSchool() {
  const errors = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.formAction === "/schools/new"
  return (
    <div className="mx-auto w-3/5 p-3">
      <div className="mb-4 flex items-center">
        <Link to="/schools" className="mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
        <h2 className="text-2xl font-bold">Add New School</h2>
      </div>
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

        <fieldset className="space-y-6">
          <legend className="text-lg font-medium text-gray-900">Address</legend>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address Number
            </label>
            <input
              name="nameOrNumber"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Town or city
            </label>
            <input
              name="townOrCity"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Code
            </label>
            <input
              name="addressCode"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              name="country"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </fieldset>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isSubmitting ? "Saving..." : "Create School"}
        </button>
      </Form>
    </div>
  )
}
