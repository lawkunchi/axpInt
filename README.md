### Project 1:

How to run the project
1. Install dependencies `npm ci`
2. To setup Edgedb follow the instructions on https://www.edgedb.com/install#linux-debianubuntults to setup the Edgedb cli. Then
3. Then use `edgedb project init` to create an edgedb database and run the migration The databse will be populated with a starting schema defined by the default.esdl file.
4. To start development, run the remix server use: `npm run dev`
5. List of schools on this path `/schools`
6. Adding a new school to the database found on this path `/schools/new`
7. Filter schools can bef filtered by address name or town/ciy 
