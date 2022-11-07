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
              {...{ track, focusWithinTrack, clickFocusWithinTrack, onKeyDown }}
            />
          );
        })}
      </ol>
      <button>Random button to focus on</button>
    </main>
  );
}

const Track = React.forwardRef(
  ({ track, focusWithinTrack, clickFocusWithinTrack, ...props }, ref) => {
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

    const onButtonClick = (button) => (event) => {
      event.stopPropagation();
      clickFocusWithinTrack({ track: track.id, button });
    };

    return (
      <li id={track.id} ref={trackRef} {...props}>
        <div>
          <div>{track.name}</div>
          <div>
            <Form>
              <button
                tabIndex={-1}
                ref={focusWithinTrack === "up" ? buttonRef : null}
                onClick={onButtonClick("up")}
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
                onClick={onButtonClick("down")}
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
    clickFocusWithinTrack,
    focusRef,
    onKeyDown,
  };
};
