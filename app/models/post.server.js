import { prisma } from "~/db.server";

export const getPosts = async () =>
  prisma.post.findMany({ select: { title: true, slug: true } });

export const getPost = async (slug) =>
  prisma.post.findUnique({ where: { slug } });

export const upsertPost = async (slug, post) =>
  prisma.post.upsert({
    where: { slug: slug },
    update: post,
    create: post,
  });

export const deletePost = async (slug) =>
  prisma.post.delete({ where: { slug } });
