import * as React from "react";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import { getTracks } from "./_data-sources/track.server.js";

export const loader = async () => json(await getTracks());

const useSetup = () => {
  const tracks = useLoaderData();
  const [focusTrack, setFocusTrack] = React.useState(tracks[0].id);
  const trackRef = React.useRef();
  React.useEffect(() => {
    trackRef.current && trackRef.current.focus();
  }, [focusTrack]);

  const findTrackIndex = (id) => tracks.findIndex((track) => track.id === id);

  const onKeyDown = (event) => {
    if (event.defaultPrevented) return;

    switch (event.key) {
      case "Down":
      case "ArrowDown":
        setFocusTrack((focusedTrack) => {
          const currentIndex = findTrackIndex(focusedTrack);
          const nextIndex = Math.min(currentIndex + 1, tracks.length - 1);
          return tracks[nextIndex].id;
        });
        break;
      case "Up":
      case "ArrowUp":
        setFocusTrack((focusedTrack) => {
          const currentIndex = findTrackIndex(focusedTrack);
          const nextIndex = Math.max(currentIndex - 1, 0);
          return tracks[nextIndex].id;
        });
        break;
      default:
        return;
    }
  };

  return { tracks, focusTrack, trackRef, onKeyDown };
};

export default function ReorderRoute() {
  const { tracks, focusTrack, trackRef, onKeyDown } = useSetup();
  console.debug(focusTrack);

  return (
    <main>
      <a href=".">Random link to focus on</a>
      <h2>Primary Tracks</h2>
      <ol>
        {tracks.map(({ id, name }) => {
          const hasFocus = focusTrack === id;

          return (
            <React.Fragment key={id}>
              <li
                tabIndex={hasFocus ? 0 : -1}
                ref={hasFocus ? trackRef : null}
                {...{ onKeyDown }}
              >
                {name}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
      <button>Random button to focus on</button>
    </main>
  );
}
