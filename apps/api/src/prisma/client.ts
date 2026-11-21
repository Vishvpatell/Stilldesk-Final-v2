import { PrismaClient } from "@prisma/client";

/** One shared database client. The connection string comes only from the DATABASE_URL environment variable. */
export const prisma = new PrismaClient({ log: ["error"] });
