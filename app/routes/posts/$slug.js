import { json } from "@remix-run/node";
import { marked } from "marked";
import { useLoaderData } from "@remix-run/react";

import { getPost } from "~/models/post.server";
import { throw404 } from "~/components/PostNotFound";

export const loader = async ({ params }) => {
  const post = await getPost(params.slug);

  if (!post) throw404();

  const html = marked(post.markdown);

  return json({ post, html });
};

export default function PostSlug() {
  const { post, html } = useLoaderData();

  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}

export { CatchBoundary } from "~/components/PostNotFound";
