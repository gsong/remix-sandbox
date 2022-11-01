import * as React from "react";
import { json, redirect } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";

import { getFiles } from "~/models/file.server.js";

export const action = () => redirect("/upload/thank-you");
export const loader = async () => json(await getFiles());

export default function UploadFiles() {
  const dbData = useLoaderData();
  const [pdfs, setPdfs] = React.useState([]);
  const [images, setImages] = React.useState([]);

  return (
    <>
      <h2>PDFs</h2>
      <FileForm onFetch={(data) => setPdfs((state) => [...state, ...data])} />

      <h2>Images</h2>
      <FileForm onFetch={(data) => setImages((state) => [...state, ...data])} />

      <h2>Local Form</h2>
      <Form method="post">
        <button>Hit me</button>
      </Form>

      {pdfs.length > 0 ? (
        <>
          <h2>PDFs</h2>
          <pre>{JSON.stringify(pdfs, null, 2)}</pre>
        </>
      ) : null}

      {images.length > 0 ? (
        <>
          <h2>Images</h2>
          <pre>{JSON.stringify(images, null, 2)}</pre>
        </>
      ) : null}

      {dbData.length > 0 ? (
        <>
          <h2>Database Records</h2>
          <pre>{JSON.stringify(dbData, null, 2)}</pre>
        </>
      ) : null}
    </>
  );
}

const FileForm = ({ onFetch }) => {
  const file = useFetcher();
  const ref = React.useRef();

  React.useEffect(() => {
    if (file.type === "done") {
      onFetch(file.data);
      ref.current.reset();
    }
  }, [file]);

  return (
    <file.Form
      method="post"
      encType="multipart/form-data"
      action="api/upload-file"
      ref={ref}
    >
      <label>
        Choose file:
        <input type="file" name="files" multiple />
      </label>
      <button>Upload</button>
    </file.Form>
  );
};
