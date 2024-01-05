import { FastifyInstance } from "fastify"
import { knex } from "../database"
import { z } from "zod"
import { randomUUID } from "crypto"


export async function taskRoutes(app: FastifyInstance){
  app.post('/', async (req,replay) => {

    const createTaskBodySchema = z.object({
      title:z.string(),
      description: z.string()
    })

    const {title, description} = createTaskBodySchema.parse(req.body)

    await knex("tasks").insert({
      id: randomUUID(),
      title,
      description,
    })

    return replay.status(201).send();
  }) 

  app.get("/", async (req) => {

    const createTaskBodySchema = z.object({
      search:z.string().nullable(),
    })

    const {search} = createTaskBodySchema.parse(req.query)

    let tasks

    if(search){
      tasks =await knex("tasks").where((builder) => {
        builder.orWhere('title', 'like', `%${search}%`)
          .orWhere('description', 'like', `%${search}%`);
      })
      .select();
    }else{
      tasks = await knex("tasks").select();
    }

    return { tasks };
  });
}