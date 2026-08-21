import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/** Create an event (admin/coordinator/faculty) */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    venue: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    registrationDeadline: v.string(),
    totalSeats: v.number(),
    speakers: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    if (user.role !== "admin" && user.role !== "coordinator" && user.role !== "faculty") {
      throw new Error("Not authorized to create events");
    }
    return await ctx.db.insert("events", {
      title: args.title,
      description: args.description,
      venue: args.venue,
      date: args.date,
      time: args.time,
      registrationDeadline: args.registrationDeadline,
      totalSeats: args.totalSeats,
      registeredCount: 0,
      speakers: args.speakers,
      organizerId: userId,
      organizerName: user.name || user.email || "Organizer",
      tags: args.tags,
      createdAt: Date.now(),
    });
  },
});

/** Register for an event */
export const register = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");

    if (event.registeredCount >= event.totalSeats) {
      throw new Error("Event is fully booked");
    }

    const existing = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_student", (q) => q.eq("studentId", userId))
      .filter((q) => q.eq(q.field("eventId"), args.eventId))
      .first();

    if (existing) throw new Error("Already registered");

    await ctx.db.patch(args.eventId, {
      registeredCount: event.registeredCount + 1,
    });

    return await ctx.db.insert("eventRegistrations", {
      eventId: args.eventId,
      studentId: userId,
      studentName: user.name || user.email || "Student",
      registeredAt: Date.now(),
    });
  },
});

/** Cancel registration */
export const cancelRegistration = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const reg = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_student", (q) => q.eq("studentId", userId))
      .filter((q) => q.eq(q.field("eventId"), args.eventId))
      .first();

    if (!reg) throw new Error("Not registered");

    const event = await ctx.db.get(args.eventId);
    if (event) {
      await ctx.db.patch(args.eventId, {
        registeredCount: Math.max(0, event.registeredCount - 1),
      });
    }

    await ctx.db.delete(reg._id);
  },
});

/** List all events */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("events").order("desc").take(50);
  },
});

/** Get student's registered events */
export const myRegistrations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const regs = await ctx.db
      .query("eventRegistrations")
      .withIndex("by_student", (q) => q.eq("studentId", userId))
      .collect();
    const events = await Promise.all(
      regs.map(async (r) => {
        const event = await ctx.db.get(r.eventId);
        return { ...r, event };
      }),
    );
    return events.filter((e) => e.event !== null);
  },
});

/** Get registrations for an event */
export const getRegistrations = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("eventRegistrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
  },
});
