import { moveTrackUp } from "../_data-sources/track.server.js";

export const action = async ({ request }) => {
  await moveTrackUp((await request.formData()).get("trackId"));
  return new Response();
};
