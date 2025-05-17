import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    createdAt: v.number(),
  }).index("byCreatedAt", ["createdAt"]),
});

// what is indexing in convex or databases in general?
// indexing is a way to optimize the performance of queries.
// it is a way to tell convex to create a secondary index on a field.
// this is useful for queries that are frequently run on a field.
// for example, if we have a table of tasks, and we frequently query the tasks by createdAt, we can index the createdAt field.
// this will allow us to query the tasks by createdAt much faster.
// we can also index multiple fields.