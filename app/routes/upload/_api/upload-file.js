import { unstable_parseMultipartFormData } from "@remix-run/node";

import { addFile } from "~/models/file.server.js";

export const action = async ({ request }) => {
  const os = require("node:os");
  const path = require("node:path");

  const uploadHandler = async ({ filename: name, contentType: type }) => {
    // await wait(5000);
    const filepath = path.join(os.tmpdir(), name);
    const { id } = await addFile({ name, filepath, type });
    return JSON.stringify({ id, name, filepath, type });
  };

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const files = formData.getAll("files").map((f) => JSON.parse(f));
  return files;
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
