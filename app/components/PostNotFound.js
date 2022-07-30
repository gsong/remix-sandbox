import { useCatch, useParams } from "@remix-run/react";

export function CatchBoundary() {
  const caught = useCatch();
  const { slug } = useParams();

  if (caught.status === 404) {
    return <div>Uh oh! Post with slug "{slug}" doesn't exist.</div>;
  }

  throw new Error(`Unsupported response status code: ${caught.status}`);
}

export function throw404() {
  throw new Response("Not Found", { status: 404 });
}
