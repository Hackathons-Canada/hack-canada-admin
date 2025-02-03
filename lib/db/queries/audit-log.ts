import { NeonDatabase } from "drizzle-orm/neon-serverless";
import { db } from "..";
import { auditLogs, type NewAuditLog } from "../schema";
import { sql } from "drizzle-orm";

import * as schema from "../schema";

export type CreateAuditLogParams = {
  userId: string;
  action: "create" | "view" | "update" | "delete";
  entityType: string;
  entityId: string;
  previousValue?: any;
  newValue?: any;
  metadata?: Record<string, any>;
};

/**
 * Creates an audit log entry for tracking changes in the system
 * @param params Parameters for creating an audit log
 * @returns The created audit log entry
 *
 * @example
 * // Example of logging a user role update
 * await createAuditLog({
 *   userId: "admin-123",
 *   action: "update",
 *   entityType: "user",
 *   entityId: "user-456",
 *   previousValue: { role: "user" },
 *   newValue: { role: "admin" },
 *   metadata: { reason: "User promoted to admin" }
 * });
 *
 * // Example of logging an application status update
 * await createAuditLog({
 *   userId: "admin-123",
 *   action: "update",
 *   entityType: "hackerApplication",
 *   entityId: "application-789",
 *   previousValue: { status: "not_applied" },
 *   newValue: { status: "accepted" },
 * });
 *
 * In the above example, user with ID "admin-123" performed an action on an application
 * with ID "application-789".
 *
 * The action was "update", the entity type was "hackerApplication", and the entity ID was
 * "application-789". The entity ID refers to the ID of the application in the database.
 *
 * The previous value of the application status was "not_applied", and the new value was
 * "accepted".
 *
 * Example of logging a login attempt by a non-admin user:
 * await createAuditLog({
 *   userId: "user-456",
 *   action: "create",
 *   entityType: "user",
 *   entityId: "user-456",
 *   metadata: { reason: "Failed login attempt" }
 * });
 */
export async function createAuditLog(
  params: CreateAuditLogParams,
  tx?: NeonDatabase<typeof schema>,
) {
  const dbTransaction = tx || db;

  const auditLog: NewAuditLog = {
    userId: params.userId,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    previousValue: params.previousValue
      ? JSON.stringify(params.previousValue)
      : null,
    newValue: params.newValue ? JSON.stringify(params.newValue) : null,
    metadata: params.metadata ? JSON.stringify(params.metadata) : null,
  };

  const [createdLog] = await dbTransaction
    .insert(auditLogs)
    .values(auditLog)
    .returning();
  return createdLog;
}

/**
 * Retrieves audit logs for a specific entity
 * @param entityType The type of entity (e.g., "user", "hackerApplication")
 * @param entityId The ID of the entity
 * @returns Array of audit logs for the entity
 */
export async function getAuditLogsForEntity(
  entityType: string,
  entityId: string,
) {
  return await db.query.auditLogs.findMany({
    where: (logs, { and, eq }) =>
      and(eq(logs.entityType, entityType), eq(logs.entityId, entityId)),
    orderBy: (logs, { desc }) => desc(logs.createdAt),
  });
}

/**
 * Gets the total number of audit logs
 */
export async function getNumAuditLogs() {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(auditLogs);
  return Number(result.count);
}

/**
 * Retrieves all audit logs with optional filtering
 * @param limit Maximum number of logs to retrieve
 * @param offset Number of logs to skip (for pagination)
 * @param filters Optional filters for the query
 * @returns Array of audit logs
 */
export async function getAuditLogs(
  limit: number = 50,
  offset: number = 0,
  filters?: {
    userId?: string;
    action?: "create" | "update" | "delete";
    entityType?: string;
    fromDate?: Date;
    toDate?: Date;
  },
) {
  const query = db.query.auditLogs.findMany({
    limit,
    offset,
    orderBy: (logs, { desc }) => desc(logs.createdAt),
    where: (logs, { and, eq, gte, lte }) => {
      const conditions = [];

      if (filters?.userId) {
        conditions.push(eq(logs.userId, filters.userId));
      }
      if (filters?.action) {
        conditions.push(eq(logs.action, filters.action));
      }
      if (filters?.entityType) {
        conditions.push(eq(logs.entityType, filters.entityType));
      }
      if (filters?.fromDate) {
        conditions.push(gte(logs.createdAt, filters.fromDate));
      }
      if (filters?.toDate) {
        conditions.push(lte(logs.createdAt, filters.toDate));
      }

      return conditions.length > 0 ? and(...conditions) : undefined;
    },
  });

  return await query;
}
