import { prisma } from "~/db.server";

export const addFile = async (data) =>
  prisma.file.create({ data, select: { id: true } });

export const getFiles = async () => prisma.file.findMany();
