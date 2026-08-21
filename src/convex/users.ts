import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Get the current signed in user. Returns null if the user is not signed in.
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    return await ctx.db.get(userId);
  },
});

/**
 * Set the user's role (one-time selection after first sign-in)
 */
export const setRole = mutation({
  args: {
    role: v.union(
      v.literal("student"),
      v.literal("faculty"),
      v.literal("coordinator"),
      v.literal("admin"),
    ),
    fullName: v.optional(v.string()),
    phone: v.optional(v.string()),
    department: v.optional(v.string()),
    rollNumber: v.optional(v.string()),
    semester: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // Only allow setting role once
    if (user.role) {
      throw new Error("Role already set. Contact an administrator to change.");
    }

    const updates: Record<string, unknown> = {
      role: args.role,
    };
    if (args.fullName) updates.name = args.fullName;
    if (args.phone) updates.phone = args.phone;
    if (args.department) updates.department = args.department;
    if (args.rollNumber) updates.rollNumber = args.rollNumber;
    if (args.semester) updates.semester = args.semester;

    await ctx.db.patch(userId, updates);

    return userId;
  },
});

/**
 * Update user profile
 */
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    bio: v.optional(v.string()),
    department: v.optional(v.string()),
    rollNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const updates: Record<string, unknown> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.phone !== undefined) updates.phone = args.phone;
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.department !== undefined) updates.department = args.department;
    if (args.rollNumber !== undefined) updates.rollNumber = args.rollNumber;

    await ctx.db.patch(userId, updates);
    return userId;
  },
});

/**
 * Get user stats (admin)
 */
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    if (user.role !== "admin") throw new Error("Admin only");

    const allUsers = await ctx.db.query("users").collect();
    const students = allUsers.filter((u) => u.role === "student").length;
    const faculty = allUsers.filter((u) => u.role === "faculty").length;
    const admins = allUsers.filter((u) => u.role === "admin").length;
    const coordinators = allUsers.filter((u) => u.role === "coordinator").length;

    return { total: allUsers.length, students, faculty, admins, coordinators };
  },
});

/**
 * List users (admin only)
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    if (user.role !== "admin") throw new Error("Admin only");

    return await ctx.db.query("users").collect();
  },
});

/**
 * List all students (for faculty attendance marking)
 */
export const listStudents = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db
      .query("users")
      .withIndex("role", (q) => q.eq("role", "student"))
      .collect();
  },
});

/**
 * List all users for admin panel (admin/coordinator)
 */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user || (user.role !== "admin" && user.role !== "coordinator")) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.query("users").collect();
  },
});

/**
 * Delete a user (admin only)
 */
export const removeUser = mutation({
  args: { targetUserId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") throw new Error("Admin only");

    if (args.targetUserId === userId) throw new Error("Cannot delete yourself");

    await ctx.db.delete(args.targetUserId);
    return args.targetUserId;
  },
});

/**
 * Update a user's role (admin only)
 */
export const updateRole = mutation({
  args: {
    targetUserId: v.id("users"),
    role: v.union(
      v.literal("student"),
      v.literal("faculty"),
      v.literal("coordinator"),
      v.literal("admin"),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") throw new Error("Admin only");

    await ctx.db.patch(args.targetUserId, { role: args.role });

    // Log the action
    await ctx.db.insert("activityLogs", {
      userId,
      action: "role_change",
      details: `Changed role of ${args.targetUserId} to ${args.role}`,
      createdAt: Date.now(),
    });

    return args.targetUserId;
  },
});
