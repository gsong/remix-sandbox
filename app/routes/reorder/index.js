import * as React from "react";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

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
    setFocusWithinTrack,
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
              {...{ track, focusWithinTrack, setFocusWithinTrack, onKeyDown }}
            />
          );
        })}
      </ol>
      <button>Random button to focus on</button>
    </main>
  );
}

const Track = React.forwardRef(
  ({ track, focusWithinTrack, setFocusWithinTrack, ...props }, ref) => {
    const trackRef = React.useRef();
    const buttonRef = React.useRef();

    React.useImperativeHandle(ref, () => ({
      focus: () => trackRef.current.focus(),
      get track() {
        return trackRef.current;
      },
      get button() {
        return buttonRef.current;
      },
    }));

    return (
      <li id={track.id} ref={trackRef} {...props}>
        <div>
          <div>{track.name}</div>
          <div>
            <Form>
              <button
                tabIndex={-1}
                ref={focusWithinTrack === "up" ? buttonRef : null}
                onClick={() => setFocusWithinTrack("up")}
              >
                Move up
              </button>
            </Form>
          </div>
          <div>
            <Form>
              <button
                tabIndex={-1}
                ref={focusWithinTrack === "down" ? buttonRef : null}
                onClick={() => setFocusWithinTrack("down")}
              >
                Move down
              </button>
            </Form>
          </div>
        </div>
      </li>
    );
  }
);

const useSetup = () => {
  const tracks = useLoaderData();
  const [focusTrack, setFocusTrack] = React.useState(tracks[0].id);
  const [focusWithinTrack, setFocusWithinTrack] = React.useState(null);
  const focusRef = React.useRef();

  React.useEffect(() => {
    if (focusWithinTrack) {
      focusRef.current.button.focus();
    } else {
      focusRef.current.focus();
    }
  }, [focusTrack, focusWithinTrack]);

  const findTrackIndex = (id) => tracks.findIndex((track) => track.id === id);
  const moveFocusRightWithinTrack = () => {
    switch (focusWithinTrack) {
      case "up": {
        setFocusWithinTrack("down");
        break;
      }

      case "down": {
        setFocusWithinTrack(null);
        break;
      }

      default: {
        setFocusWithinTrack("up");
      }
    }
  };

  const moveFocusLeftWithinTrack = () => {
    switch (focusWithinTrack) {
      case "up": {
        setFocusWithinTrack(null);
        break;
      }

      case "down": {
        setFocusWithinTrack("up");
        break;
      }

      default: {
        setFocusWithinTrack("down");
      }
    }
  };

  const onKeyDown = (event) => {
    if (event.defaultPrevented) return;

    switch (event.key) {
      case "Down":
      case "ArrowDown": {
        setFocusTrack((focusedTrack) => {
          const currentIndex = findTrackIndex(focusedTrack);
          const nextIndex = Math.min(currentIndex + 1, tracks.length - 1);
          return tracks[nextIndex].id;
        });
        break;
      }

      case "Up":
      case "ArrowUp": {
        setFocusTrack((focusedTrack) => {
          const currentIndex = findTrackIndex(focusedTrack);
          const nextIndex = Math.max(currentIndex - 1, 0);
          return tracks[nextIndex].id;
        });
        break;
      }

      case "Right":
      case "ArrowRight": {
        moveFocusRightWithinTrack();
        break;
      }

      case "Left":
      case "ArrowLeft": {
        moveFocusLeftWithinTrack();
        break;
      }

      default:
        return;
    }
  };

  return {
    tracks,
    focusTrack,
    setFocusTrack,
    focusWithinTrack,
    setFocusWithinTrack,
    focusRef,
    onKeyDown,
  };
};
