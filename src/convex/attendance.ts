import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/** Faculty creates an attendance session */
export const createSession = mutation({
  args: {
    title: v.string(),
    subject: v.string(),
    department: v.optional(v.string()),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    if (user.role !== "faculty" && user.role !== "admin") {
      throw new Error("Only faculty can create attendance sessions");
    }
    return await ctx.db.insert("attendanceSessions", {
      title: args.title,
      subject: args.subject,
      facultyId: userId,
      facultyName: user.name || user.email || "Faculty",
      department: args.department,
      date: args.date,
      createdAt: Date.now(),
    });
  },
});

/** Faculty marks attendance for multiple students */
export const markAttendance = mutation({
  args: {
    sessionId: v.id("attendanceSessions"),
    records: v.array(
      v.object({
        studentId: v.id("users"),
        studentName: v.string(),
        present: v.boolean(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    if (user.role !== "faculty" && user.role !== "admin") {
      throw new Error("Only faculty can mark attendance");
    }

    for (const record of args.records) {
      const existing = await ctx.db
        .query("attendanceRecords")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .filter((q) => q.eq(q.field("studentId"), record.studentId))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          present: record.present,
          markedAt: Date.now(),
        });
      } else {
        await ctx.db.insert("attendanceRecords", {
          sessionId: args.sessionId,
          studentId: record.studentId,
          studentName: record.studentName,
          present: record.present,
          markedAt: Date.now(),
        });
      }
    }
  },
});

/** Get sessions created by the current faculty */
export const mySessions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("attendanceSessions")
      .withIndex("by_faculty", (q) => q.eq("facultyId", userId))
      .order("desc")
      .take(20);
  },
});

/** Get all sessions */
export const listSessions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("attendanceSessions")
      .order("desc")
      .take(50);
  },
});

/** Get records for a session */
export const getSessionRecords = query({
  args: { sessionId: v.id("attendanceSessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("attendanceRecords")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
  },
});

/** Student gets their attendance records */
export const myAttendance = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("attendanceRecords")
      .withIndex("by_student", (q) => q.eq("studentId", userId))
      .collect();
  },
});

/** Get attendance stats for current student */
export const myStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { total: 0, present: 0, percentage: 0 };

    const records = await ctx.db
      .query("attendanceRecords")
      .withIndex("by_student", (q) => q.eq("studentId", userId))
      .collect();

    const total = records.length;
    const present = records.filter((r) => r.present).length;
    return {
      total,
      present,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  },
});
