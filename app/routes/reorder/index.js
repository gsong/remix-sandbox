import * as React from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import Track from "./_components/Track.js";
import { getTracks } from "./_data-sources/track.server.js";

import styles from "./styles/index.css";

export const loader = async () => json(await getTracks());

export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function ReorderRoute() {
  const {
    tracks,
    focusTrack,
    setFocusTrack,
    focusWithinTrack,
    clickFocusWithinTrack,
    focusRef,
    onKeyDown,
  } = useSetup();

  return (
    <main>
      <a href=".">Random link to focus on</a>
      <h2>Primary Tracks</h2>
      <ol>
        {tracks.map((track) => {
          const hasFocus = focusTrack === track.id;
          return (
            <Track
              key={track.id}
              tabIndex={hasFocus ? 0 : -1}
              ref={hasFocus ? focusRef : null}
              onClick={(e) => {
                setFocusTrack(e.currentTarget.id);
              }}
              {...{
                track,
                focusWithinTrack,
                clickFocusWithinTrack,
                onKeyDown,
              }}
            />
          );
        })}
      </ol>
      <button>Random button to focus on</button>
    </main>
  );
}

const reducer = (state, action) => {
  switch (action.type) {
    case "set-track": {
      const focusTrack =
        typeof action.value === "function" ? action.value(state) : action.value;

      return { focusTrack, focusWithinTrack: null };
    }

    case "set-within": {
      return { ...state, focusWithinTrack: action.value };
    }

    case "click-within": {
      return {
        focusTrack: action.value.track,
        focusWithinTrack: action.value.button,
      };
    }

    default:
      throw new Error(`Invalid action ${action.type}`);
  }
};

const FOCUS_WITHIN_FSM = new Map([
  ["default", null],
  [null, { next: "up", previous: "down" }],
  ["up", { next: "down", previous: null }],
  ["down", { next: null, previous: "up" }],
]);

const useSetup = () => {
  const tracks = useLoaderData();
  const [{ focusTrack, focusWithinTrack }, dispatch] = React.useReducer(
    reducer,
    {
      focusTrack: tracks[0].id,
      focusWithinTrack: null,
    }
  );
  const focusRef = React.useRef();

  React.useEffect(() => {
    if (focusWithinTrack) {
      focusRef.current.button.focus();
    } else {
      focusRef.current.focus();
    }
  }, [focusTrack, focusWithinTrack]);

  const findTrackIndex = (id) => tracks.findIndex((track) => track.id === id);
  const setFocusTrack = (value) => dispatch({ type: "set-track", value });
  const setFocusWithinTrack = (value) =>
    dispatch({ type: "set-within", value });
  const clickFocusWithinTrack = (value) =>
    dispatch({ type: "click-within", value });

  const moveFocusWithinTrack = (transition) =>
    setFocusWithinTrack(FOCUS_WITHIN_FSM.get(focusWithinTrack)[transition]);

  const onKeyDown = (event) => {
    if (event.defaultPrevented) return;

    switch (event.key) {
      case "Down":
      case "ArrowDown": {
        setFocusTrack(({ focusTrack }) => {
          const currentIndex = findTrackIndex(focusTrack);
          const nextIndex = Math.min(currentIndex + 1, tracks.length - 1);
          return tracks[nextIndex].id;
        });
        break;
      }

      case "Up":
      case "ArrowUp": {
        setFocusTrack(({ focusTrack }) => {
          const currentIndex = findTrackIndex(focusTrack);
          const nextIndex = Math.max(currentIndex - 1, 0);
          return tracks[nextIndex].id;
        });
        break;
      }

      case "PageUp": {
        setFocusTrack(tracks[0].id);
        break;
      }

      case "PageDown": {
        setFocusTrack(tracks[tracks.length - 1].id);
        break;
      }

      case "Right":
      case "ArrowRight": {
        moveFocusWithinTrack("next");
        break;
      }

      case "Left":
      case "ArrowLeft": {
        moveFocusWithinTrack("previous");
        break;
      }

      default:
        console.info(event.key);
        return;
    }
  };

  return {
    tracks,
    focusTrack,
    setFocusTrack,
    focusWithinTrack,
    clickFocusWithinTrack,
    focusRef,
    onKeyDown,
  };
};
