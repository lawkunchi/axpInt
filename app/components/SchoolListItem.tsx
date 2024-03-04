export type SchoolItem = {
  name: string
  address: string
}

export default function SchoolListItem({ name, address }: SchoolItem) {
  return (
    <div className="w-full p-3">
      <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Address
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <tr>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm text-gray-900">{name}</div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm text-gray-900">{address}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
