import { prisma } from "~/db.server";

export const getTracks = () =>
  prisma.track.findMany({ orderBy: { trackNumber: "asc" } });
