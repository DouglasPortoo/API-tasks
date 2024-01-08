import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "crypto";
import { Knex } from "knex";

interface updateDataSchema {
  title?: string;
  description?: string;
  updated_at?: Knex.Raw<any>;
}

export async function taskRoutes(app: FastifyInstance) {
  app.post("/", async (req, replay) => {
    const createTaskBodySchema = z.object({
      title: z.string(),
      description: z.string(),
    });

    const { title, description } = createTaskBodySchema.parse(req.body);

    await knex("tasks").insert({
      id: randomUUID(),
      title,
      description,
    });

    return replay.status(201).send();
  });

  app.get("/", async (req) => {
    const createTaskBodySchema = z.object({
      search: z.string().nullable(),
    });

    const { search } = createTaskBodySchema.parse(req.query);

    let tasks;

    if (search) {
      tasks = await knex("tasks")
        .where((builder) => {
          builder
            .orWhere("title", "like", `%${search}%`)
            .orWhere("description", "like", `%${search}%`);
        })
        .select();
    } else {
      tasks = await knex("tasks").select();
    }

    return { tasks };
  });

  app.put("/:id", async (req,replay) => {
    const createTaskIdBodySchema = z.object({
      id: z.string().uuid(),
    });

    const createTaskBodySchema = z.object({
      title: z.string().nullable(),
      description: z.string().nullable(),
    });

    const { id } = createTaskIdBodySchema.parse(req.params);
    const { title, description } = createTaskBodySchema.parse(req.body);

    const [taskExist] = await knex("tasks").where({ id });

    if (taskExist === undefined) {
      return replay.status(404).send("Task nao existe no banco");
    }

    const updateData: updateDataSchema = {};

    if (title && title !== taskExist.title) {
      updateData.title = title;
    }

    if (description && description !== taskExist.description) {
      updateData.description = description;
    }

    if (Object.keys(updateData).length > 0) {
      updateData.updated_at = knex.raw("CURRENT_TIMESTAMP");

      await knex("tasks").where({ id }).update(updateData);
    }

    const [taskUpdated] = await knex("tasks").where({ id });

    return { taskUpdated };
  });

  app.delete("/:id", async (req, replay) => {
    const createTaskIdBodySchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = createTaskIdBodySchema.parse(req.params);

    const [taskExist] = await knex("tasks").where({ id });

    if (taskExist === undefined) {
      return replay.status(404).send("Task nao existe no banco");
    }

    await knex("tasks").where({ id }).del();

    return replay.status(204).send();
  });

  app.patch("/:id/complete", async (req, replay) => {
    const createTaskIdBodySchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = createTaskIdBodySchema.parse(req.params);

    const [taskExist] = await knex("tasks").where({ id });

    if (taskExist === undefined) {
      return replay.status(404).send("Task nao existe no banco");
    }

    const isTaskCompleted = !!taskExist.completed_at;

    const completed_at = isTaskCompleted ? null : knex.raw("CURRENT_TIMESTAMP");

    await knex("tasks").where({ id }).update("completed_at", completed_at);

    const [taskUpdated] = await knex("tasks").where({ id });

    return { taskUpdated };
  });
}
