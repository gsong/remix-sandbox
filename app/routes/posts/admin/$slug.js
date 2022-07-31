import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import * as React from "react";

import { deletePost, getPost, upsertPost } from "~/models/post.server";
import { throw404 } from "~/components/PostNotFound";

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export const action = async ({ request, params }) => {
  const formData = await request.formData();

  if (formData.get("intent") === "delete") {
    await deletePost(params.slug);
  } else {
    const title = formData.get("title");
    const slug = formData.get("slug");
    const markdown = formData.get("markdown");

    const errors = {
      title: title ? null : "Title is required",
      slug: slug ? null : "Slug is required",
      markdown: markdown ? null : "Markdown is required",
    };
    const hasErrors = Object.values(errors).some(
      (errorMessage) => errorMessage
    );
    if (hasErrors) {
      return json(errors);
    }

    await upsertPost(params.slug, { title, slug, markdown });
  }

  return redirect("/posts/admin");
};

export const loader = async ({ params }) => {
  if (params.slug === "new") return json({});
  const post = await getPost(params.slug);

  if (!post) throw404();

  return json({ post });
};

export default function CreateOrEditPost() {
  const { post } = useLoaderData();
  const errors = useActionData();
  const transition = useTransition();
  const isPosting = Boolean(transition.submission);

  return (
    <>
      {post ? (
        <Form method="post">
          <button
            name="intent"
            value="delete"
            className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
            disabled={isPosting}
          >
            {isPosting ? "Deleting…" : "Delete Post"}
          </button>
        </Form>
      ) : null}

      <Form method="post" key={post?.slug ?? "new"}>
        <p>
          <label>
            Post Title:{" "}
            {errors?.title ? (
              <em className="text-red-600">{errors.title}</em>
            ) : null}
            <input
              type="text"
              name="title"
              defaultValue={post?.title}
              className={inputClassName}
            />
          </label>
        </p>
        <p>
          <label>
            Post Slug:{" "}
            {errors?.slug ? (
              <em className="text-red-600">{errors.slug}</em>
            ) : null}
            <input
              type="text"
              name="slug"
              defaultValue={post?.slug}
              className={inputClassName}
            />
          </label>
        </p>
        <p>
          <label htmlFor="markdown">
            Markdown:{" "}
            {errors?.markdown ? (
              <em className="text-red-600">{errors.markdown}</em>
            ) : null}
          </label>
          <br />
          <textarea
            id="markdown"
            rows={20}
            name="markdown"
            defaultValue={post?.markdown}
            className={`${inputClassName} font-mono`}
          />
        </p>
        <p className="text-right">
          <button
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
            disabled={isPosting}
          >
            {isPosting
              ? post
                ? "Updating…"
                : "Creating…"
              : post
              ? "Update Post"
              : "Create Post"}
          </button>
        </p>
      </Form>
    </>
  );
}

export { CatchBoundary } from "~/components/PostNotFound";
export { ErrorBoundary } from "~/components/ErrorBoundary";
