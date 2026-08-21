import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/** Faculty creates an assignment */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    subject: v.string(),
    department: v.optional(v.string()),
    deadline: v.string(),
    rubric: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    if (user.role !== "faculty" && user.role !== "admin") {
      throw new Error("Only faculty can create assignments");
    }
    return await ctx.db.insert("assignments", {
      title: args.title,
      description: args.description,
      subject: args.subject,
      facultyId: userId,
      facultyName: user.name || user.email || "Faculty",
      department: args.department,
      deadline: args.deadline,
      rubric: args.rubric,
      createdAt: Date.now(),
    });
  },
});

/** Student submits an assignment */
export const submit = mutation({
  args: {
    assignmentId: v.id("assignments"),
    submissionUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment) throw new Error("Assignment not found");

    const isLate = Date.now() > new Date(assignment.deadline).getTime();

    // Check if already submitted
    const existing = await ctx.db
      .query("assignmentSubmissions")
      .withIndex("by_assignment", (q) => q.eq("assignmentId", args.assignmentId))
      .filter((q) => q.eq(q.field("studentId"), userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        submissionUrl: args.submissionUrl,
        submittedAt: Date.now(),
        status: isLate ? "late" : "submitted",
        marks: undefined,
        feedback: undefined,
      });
      return existing._id;
    }

    return await ctx.db.insert("assignmentSubmissions", {
      assignmentId: args.assignmentId,
      studentId: userId,
      studentName: user.name || user.email || "Student",
      submissionUrl: args.submissionUrl,
      submittedAt: Date.now(),
      status: isLate ? "late" : "submitted",
    });
  },
});

/** Faculty grades a submission */
export const grade = mutation({
  args: {
    submissionId: v.id("assignmentSubmissions"),
    marks: v.number(),
    feedback: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    if (user.role !== "faculty" && user.role !== "admin") {
      throw new Error("Only faculty can grade submissions");
    }
    await ctx.db.patch(args.submissionId, {
      marks: args.marks,
      feedback: args.feedback,
      status: "graded",
    });
  },
});

/** List all assignments */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("assignments").order("desc").take(50);
  },
});

/** Get submissions for an assignment */
export const getSubmissions = query({
  args: { assignmentId: v.id("assignments") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("assignmentSubmissions")
      .withIndex("by_assignment", (q) => q.eq("assignmentId", args.assignmentId))
      .collect();
  },
});

/** Get student's submissions */
export const mySubmissions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("assignmentSubmissions")
      .withIndex("by_student", (q) => q.eq("studentId", userId))
      .collect();
  },
});
