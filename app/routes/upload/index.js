import * as React from "react";

import { useFetcher } from "@remix-run/react";

export default function AvatarUploadRoute() {
  const file = useFetcher();
  const ref = React.useRef();

  React.useEffect(() => {
    if (file.type === "done") {
      ref.current.reset();
    }
  }, [file]);

  return (
    <>
      <file.Form
        method="post"
        encType="multipart/form-data"
        action="api/upload-file"
        ref={ref}
      >
        <label htmlFor="avatar-input">Avatar</label>
        <input id="avatar-input" type="file" name="avatar" />
        <button>Upload</button>
      </file.Form>

      {file.data ? <pre>{JSON.stringify(file.data, null, 2)}</pre> : null}
    </>
  );
}
