import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("tasks").collect();
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

export const add = mutation({
    args: { text: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.insert("tasks", { text: args.text, isCompleted: false, createdAt: Date.now() });
    },
});

export const deleteTask = mutation({
    args: { id: v.id("tasks") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const destructTask = internalMutation({
    args: { taskId: v.id("tasks") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.taskId);
    },
});

const WEEK_OLD = 7 * 24 * 60 * 60 * 1000;

const DAY_IN_MS = 0;

export const scheduleDestructWeekOldTasks = mutation({
    args: {},
    handler: async (ctx) => {
        const today = new Date();
        today.setDate(today.getDate() - WEEK_OLD);
        const tasks = await ctx.db.query("tasks").filter(q => q.lt(q.field("createdAt"), today.getTime())).collect();
        for (const task of tasks) {
            await ctx.scheduler.runAfter(DAY_IN_MS, internal.tasks.destructTask, {
                taskId: task._id,
            });
        }
    },
});