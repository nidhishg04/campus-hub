import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const ROLES = {
  ADMIN: "admin",
  FACULTY: "faculty",
  STUDENT: "student",
  COORDINATOR: "coordinator",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.FACULTY),
  v.literal(ROLES.STUDENT),
  v.literal(ROLES.COORDINATOR),
);
export type Role = Infer<typeof roleValidator>;

export const ANNOUNCEMENT_PRIORITY = {
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export const announcementPriorityValidator = v.union(
  v.literal(ANNOUNCEMENT_PRIORITY.LOW),
  v.literal(ANNOUNCEMENT_PRIORITY.NORMAL),
  v.literal(ANNOUNCEMENT_PRIORITY.HIGH),
  v.literal(ANNOUNCEMENT_PRIORITY.URGENT),
);

const schema = defineSchema(
  {
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
      department: v.optional(v.string()),
      rollNumber: v.optional(v.string()),
      phone: v.optional(v.string()),
      bio: v.optional(v.string()),
      semester: v.optional(v.number()),
      skills: v.optional(v.array(v.string())),
      linkedin: v.optional(v.string()),
      github: v.optional(v.string()),
    })
      .index("email", ["email"])
      .index("role", ["role"]),

    announcements: defineTable({
      title: v.string(),
      content: v.string(),
      authorId: v.id("users"),
      authorName: v.string(),
      authorRole: roleValidator,
      department: v.optional(v.string()),
      priority: announcementPriorityValidator,
      isPinned: v.optional(v.boolean()),
      tags: v.optional(v.array(v.string())),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_created", ["createdAt"])
      .index("by_author", ["authorId"])
      .index("by_priority", ["priority"])
      .index("by_department", ["department"]),

    departments: defineTable({
      name: v.string(),
      code: v.string(),
      description: v.optional(v.string()),
    }).index("by_code", ["code"]),

    attendanceSessions: defineTable({
      title: v.string(),
      subject: v.string(),
      facultyId: v.id("users"),
      facultyName: v.string(),
      department: v.optional(v.string()),
      date: v.string(),
      createdAt: v.number(),
    })
      .index("by_faculty", ["facultyId"])
      .index("by_date", ["date"]),

    attendanceRecords: defineTable({
      sessionId: v.id("attendanceSessions"),
      studentId: v.id("users"),
      studentName: v.string(),
      present: v.boolean(),
      markedAt: v.number(),
    })
      .index("by_session", ["sessionId"])
      .index("by_student", ["studentId"]),

    assignments: defineTable({
      title: v.string(),
      description: v.string(),
      subject: v.string(),
      facultyId: v.id("users"),
      facultyName: v.string(),
      department: v.optional(v.string()),
      deadline: v.string(),
      rubric: v.optional(v.string()),
      createdAt: v.number(),
    })
      .index("by_faculty", ["facultyId"])
      .index("by_deadline", ["deadline"]),

    assignmentSubmissions: defineTable({
      assignmentId: v.id("assignments"),
      studentId: v.id("users"),
      studentName: v.string(),
      submissionUrl: v.string(),
      submittedAt: v.number(),
      marks: v.optional(v.number()),
      feedback: v.optional(v.string()),
      status: v.union(
        v.literal("submitted"),
        v.literal("graded"),
        v.literal("late"),
      ),
    })
      .index("by_assignment", ["assignmentId"])
      .index("by_student", ["studentId"]),

    events: defineTable({
      title: v.string(),
      description: v.string(),
      banner: v.optional(v.string()),
      venue: v.string(),
      date: v.string(),
      time: v.optional(v.string()),
      registrationDeadline: v.string(),
      totalSeats: v.number(),
      registeredCount: v.number(),
      speakers: v.optional(v.array(v.string())),
      organizerId: v.id("users"),
      organizerName: v.string(),
      tags: v.optional(v.array(v.string())),
      createdAt: v.number(),
    })
      .index("by_date", ["date"])
      .index("by_organizer", ["organizerId"]),

    eventRegistrations: defineTable({
      eventId: v.id("events"),
      studentId: v.id("users"),
      studentName: v.string(),
      registeredAt: v.number(),
    })
      .index("by_event", ["eventId"])
      .index("by_student", ["studentId"]),

    placements: defineTable({
      company: v.string(),
      jobRole: v.string(),
      description: v.string(),
      eligibility: v.string(),
      ctc: v.string(),
      deadline: v.string(),
      department: v.optional(v.string()),
      postedBy: v.id("users"),
      postedByName: v.string(),
      createdAt: v.number(),
    })
      .index("by_deadline", ["deadline"])
      .index("by_company", ["company"]),

    placementApplications: defineTable({
      placementId: v.id("placements"),
      studentId: v.id("users"),
      studentName: v.string(),
      resumeUrl: v.optional(v.string()),
      appliedAt: v.number(),
      status: v.union(
        v.literal("applied"),
        v.literal("shortlisted"),
        v.literal("rejected"),
        v.literal("selected"),
      ),
    })
      .index("by_placement", ["placementId"])
      .index("by_student", ["studentId"]),

    notifications: defineTable({
      userId: v.id("users"),
      title: v.string(),
      message: v.string(),
      type: v.union(
        v.literal("announcement"),
        v.literal("assignment"),
        v.literal("attendance"),
        v.literal("event"),
        v.literal("placement"),
        v.literal("system"),
      ),
      read: v.boolean(),
      link: v.optional(v.string()),
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_read", ["userId", "read"]),

    activityLogs: defineTable({
      userId: v.id("users"),
      action: v.string(),
      details: v.optional(v.string()),
      createdAt: v.number(),
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
