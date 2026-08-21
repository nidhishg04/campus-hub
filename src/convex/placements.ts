import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/** Admin/faculty posts a placement */
export const create = mutation({
  args: {
    company: v.string(),
    jobRole: v.string(),
    description: v.string(),
    eligibility: v.string(),
    ctc: v.string(),
    deadline: v.string(),
    department: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    if (user.role !== "admin" && user.role !== "faculty") {
      throw new Error("Not authorized to post placements");
    }
    return await ctx.db.insert("placements", {
      company: args.company,
      jobRole: args.jobRole,
      description: args.description,
      eligibility: args.eligibility,
      ctc: args.ctc,
      deadline: args.deadline,
      department: args.department,
      postedBy: userId,
      postedByName: user.name || user.email || "Admin",
      createdAt: Date.now(),
    });
  },
});

/** Student applies for a placement */
export const apply = mutation({
  args: {
    placementId: v.id("placements"),
    resumeUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const existing = await ctx.db
      .query("placementApplications")
      .withIndex("by_student", (q) => q.eq("studentId", userId))
      .filter((q) => q.eq(q.field("placementId"), args.placementId))
      .first();

    if (existing) throw new Error("Already applied");

    return await ctx.db.insert("placementApplications", {
      placementId: args.placementId,
      studentId: userId,
      studentName: user.name || user.email || "Student",
      resumeUrl: args.resumeUrl,
      appliedAt: Date.now(),
      status: "applied",
    });
  },
});

/** List all placements */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("placements").order("desc").take(50);
  },
});

/** Get student's applications */
export const myApplications = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const apps = await ctx.db
      .query("placementApplications")
      .withIndex("by_student", (q) => q.eq("studentId", userId))
      .collect();
    const results = await Promise.all(
      apps.map(async (a) => {
        const placement = await ctx.db.get(a.placementId);
        return { ...a, placement };
      }),
    );
    return results.filter((r) => r.placement !== null);
  },
});

/** Get applications for a placement */
export const getApplications = query({
  args: { placementId: v.id("placements") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("placementApplications")
      .withIndex("by_placement", (q) => q.eq("placementId", args.placementId))
      .collect();
  },
});
