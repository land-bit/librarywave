import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export const fileTypes = v.union(
  v.literal("image"),
  v.literal("csv"),
  v.literal("pdf")
);

const schema = defineSchema({
  ...authTables,

  book: defineTable({
    openLibraryId: v.string(),
    title: v.string(),
    author: v.string(),
    coverUrl: v.union(v.string(), v.null()),
    description: v.optional(v.union(v.string(), v.null())),
  }).index("by_openLibraryId", ["openLibraryId"]),

  bookmark: defineTable({
    userId: v.id("users"),
    bookId: v.id("book"),
  }).index("by_userId", ["userId", "bookId"]),

  post: defineTable({
    userId: v.id("users"),
    bookId: v.id("book"),
    title: v.string(),
    body: v.string(),
  })
    .index("by_bookId", ["bookId"])
    .index("by_userId", ["userId"]),

  comment: defineTable({
    userId: v.id("users"),
    postId: v.id("post"),
    parentId: v.union(v.id("comment"), v.null()),
    body: v.string(),
  })
    .index("by_postId", ["postId"])
    .index("by_parentId", ["parentId"]),

  notification: defineTable({
    message: v.string(),
    isRead: v.boolean(),
    userId: v.id("users"),
  })
    .index("by_isRead", ["isRead"])
    .index("by_userId", ["userId"]),

  like: defineTable({
    userId: v.id("users"),
    postId: v.id("post"),
  }).index("by_userId", ["userId", "postId"]),

  files: defineTable({
    name: v.string(),
    type: fileTypes,
    userId: v.id("users"),
    fileId: v.id("_storage"),
    postId: v.id("post"),
  }).index("by_postId", ["postId"]),
});

export default schema;
