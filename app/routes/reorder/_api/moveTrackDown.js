import { moveTrackDown } from "../_data-sources/track.server.js";

export const action = async ({ request }) => {
  await moveTrackDown((await request.formData()).get("trackId"));
  return new Response();
};
