import { json, createRequestHandler } from "@remix-run/none"
import edgedb from "edgedb"
import helmet from "helmet"
import * as yup from "yup"
import e from "#dbschema/edgeql-js/index"

const School = { name: "Anxend School" } // Just an example this won't actually run unless it was called.

const newSchool = await e.insert(e.School, School).run(client)

const schema = yup.object().shape({
  name: yup.string().required(),
  address: yup.string().required(),
})

export default createRequestHandler({
  get: async ({ req }) => {},

  post: async ({ req, res }) => {
    console.log("hello world")
  },
})
