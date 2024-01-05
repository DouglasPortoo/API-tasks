import fastify from "fastify";
import { knex } from "./database";

const app = fastify()

app.get('/', async () => {
  const tables = await knex('tasks').select('*')

  return tables
}) 

app.listen({
  port:3333
}).then(()=>{
  console.log("Rodando....")
})