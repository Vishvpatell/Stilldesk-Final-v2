import { Prisma, type PrismaClient, type WaitlistEntry } from "@prisma/client";
import type { SurveyAnswers } from "../schemas";
import { DuplicateEmailError, type EntryRecord, type WaitlistRepo } from "../services/types";

const toRecord = (e: WaitlistEntry): EntryRecord => ({
  id: e.id, email: e.email, name: e.name, confirmedAt: e.confirmedAt, unsubscribedAt: e.unsubscribedAt,
  confirmTokenHash: e.confirmTokenHash, confirmTokenExpiresAt: e.confirmTokenExpiresAt,
});
const orNull = (e: WaitlistEntry | null) => (e ? toRecord(e) : null);

export function createPrismaRepo(db: PrismaClient): WaitlistRepo {
  return {
    findByEmail: async (email) => orNull(await db.waitlistEntry.findUnique({ where: { email } })),
    findByTokenHash: async (hash) => orNull(await db.waitlistEntry.findFirst({ where: { confirmTokenHash: hash } })),
    findById: async (id) => {
      if (!/^[a-f\d]{24}$/i.test(id)) return null; // not a valid ObjectId: treat as not found instead of throwing
      return orNull(await db.waitlistEntry.findUnique({ where: { id } }));
    },
    create: async (d) => {
      try {
        return toRecord(await db.waitlistEntry.create({ data: { ...d, consent: true } }));
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") throw new DuplicateEmailError();
        throw e;
      }
    },
    resetForResend: async (id, d) => {
      await db.waitlistEntry.update({ where: { id }, data: { ...d, consent: true, confirmedAt: null, unsubscribedAt: null } });
    },
    confirm: async (id, at) => {
      await db.waitlistEntry.update({ where: { id }, data: { confirmedAt: at, confirmTokenHash: null, confirmTokenExpiresAt: null } });
    },
    setUnsubscribed: async (id, at) => { await db.waitlistEntry.update({ where: { id }, data: { unsubscribedAt: at } }); },
    saveSurvey: async (id, survey: SurveyAnswers, betaOptIn) => {
      await db.waitlistEntry.update({ where: { id }, data: { survey: survey as Prisma.InputJsonValue, betaOptIn } });
    },
    createFeedback: async (d) => { await db.feedback.create({ data: d }); },
  };
}
