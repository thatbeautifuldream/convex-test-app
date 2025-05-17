import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// what is a query in convex?
// a query is a way to read data from the database.
// it is a way to tell convex to read data from the database.
// for example, if we have a table of tasks, and we want to read all the tasks, we can use a query.
// we can also use queries to read data from multiple tables.
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("tasks").collect();
    },
});

// what is a mutation in convex?
// a mutation is a way to write data to the database.
// it is a way to tell convex to write data to the database.
// for example, if we have a table of tasks, and we want to add a new task, we can use a mutation.
// we can also use mutations to update or delete data in the database.
export const add = mutation({
    args: { text: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.insert("tasks", { text: args.text, isCompleted: false, createdAt: Date.now() });
    },
});


export const toggleComplete = mutation({
    args: { id: v.id("tasks") },
    handler: async (ctx, args) => {
        const task = await ctx.db.get(args.id);
        if (!task) {
            throw new Error("Task not found");
        }
        await ctx.db.patch(args.id, { isCompleted: !task.isCompleted });
    },
});

export const deleteTask = mutation({
    args: { id: v.id("tasks") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
