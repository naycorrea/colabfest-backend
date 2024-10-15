import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { z } from "zod";

const app = fastify();

const prisma = new PrismaClient();

app.get("/events", async () => {
  const events = await prisma.event.findMany();

  return { events };
});

app.post("/events", async (request, reply) => {
  const createEventSchema = z.object({
    event: z.string(),
    date: z.string(),
    hour: z.string(),
    address: z.string(),
    message: z.string(),
  });

  const { event, hour, date, address, message } = createEventSchema.parse(
    request.body
  );

  await prisma.event.create({
    data: {
      event,
      date,
      hour,
      address,
      message,
    },
  });

  return reply.status(201).send();
});

app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => {
    console.log("HTTP Server Running");
  });
