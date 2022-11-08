import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getPosts } from "~/models/post.server";

export const loader = async () => json({ posts: await getPosts() });

export default function Posts() {
  const { posts } = useLoaderData();

  return (
    <main>
      <h1>Posts</h1>

      <Link to="admin" className="text-red-600 underline">
        Admin
      </Link>

      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to={post.slug}
              prefetch="intent"
              className="text-blue-600 underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
