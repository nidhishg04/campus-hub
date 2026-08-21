import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ANNOUNCEMENT_PRIORITY } from "./schema";

/**
 * Create a new announcement (faculty/admin only)
 */
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    department: v.optional(v.string()),
    priority: v.union(
      v.literal(ANNOUNCEMENT_PRIORITY.LOW),
      v.literal(ANNOUNCEMENT_PRIORITY.NORMAL),
      v.literal(ANNOUNCEMENT_PRIORITY.HIGH),
      v.literal(ANNOUNCEMENT_PRIORITY.URGENT),
    ),
    tags: v.optional(v.array(v.string())),
    isPinned: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    if (user.role !== "faculty" && user.role !== "admin") {
      throw new Error("Only faculty and admins can create announcements");
    }

    const now = Date.now();
    const announcementId = await ctx.db.insert("announcements", {
      title: args.title,
      content: args.content,
      authorId: userId,
      authorName: user.name || user.email || "Unknown",
      authorRole: user.role,
      department: args.department,
      priority: args.priority,
      tags: args.tags,
      isPinned: args.isPinned ?? false,
      createdAt: now,
      updatedAt: now,
    });

    return announcementId;
  },
});

/**
 * Update an announcement (author or admin only)
 */
export const update = mutation({
  args: {
    id: v.id("announcements"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    department: v.optional(v.string()),
    priority: v.optional(
      v.union(
        v.literal(ANNOUNCEMENT_PRIORITY.LOW),
        v.literal(ANNOUNCEMENT_PRIORITY.NORMAL),
        v.literal(ANNOUNCEMENT_PRIORITY.HIGH),
        v.literal(ANNOUNCEMENT_PRIORITY.URGENT),
      ),
    ),
    tags: v.optional(v.array(v.string())),
    isPinned: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const announcement = await ctx.db.get(args.id);
    if (!announcement) throw new Error("Announcement not found");

    if (announcement.authorId !== userId && user.role !== "admin") {
      throw new Error("Not authorized to update this announcement");
    }

    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.title !== undefined) updates.title = args.title;
    if (args.content !== undefined) updates.content = args.content;
    if (args.department !== undefined) updates.department = args.department;
    if (args.priority !== undefined) updates.priority = args.priority;
    if (args.tags !== undefined) updates.tags = args.tags;
    if (args.isPinned !== undefined) updates.isPinned = args.isPinned;

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

/**
 * Delete an announcement (author or admin only)
 */
export const remove = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const announcement = await ctx.db.get(args.id);
    if (!announcement) throw new Error("Announcement not found");

    if (announcement.authorId !== userId && user.role !== "admin") {
      throw new Error("Not authorized to delete this announcement");
    }

    await ctx.db.delete(args.id);
  },
});

/**
 * Get all announcements, newest first. Optionally filter by department.
 */
export const list = query({
  args: {
    department: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    let results;
    if (args.department) {
      results = await ctx.db
        .query("announcements")
        .withIndex("by_department", (idx) =>
          idx.eq("department", args.department!),
        )
        .order("desc")
        .take(limit);
    } else {
      results = await ctx.db
        .query("announcements")
        .order("desc")
        .take(limit);
    }

    // Sort: pinned first, then by creation date
    return results.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.createdAt - a.createdAt;
    });
  },
});

/**
 * Get a single announcement by ID
 */
export const get = query({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get announcements by a specific author
 */
export const getByAuthor = query({
  args: { authorId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("announcements")
      .withIndex("by_author", (idx) => idx.eq("authorId", args.authorId))
      .order("desc")
      .take(20);
  },
});

/**
 * Search announcements by title or content
 */
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("announcements").order("desc").take(100);
    const lower = args.query.toLowerCase();
    return all.filter(
      (a) =>
        a.title.toLowerCase().includes(lower) ||
        a.content.toLowerCase().includes(lower),
    );
  },
});
