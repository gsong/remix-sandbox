import * as React from "react";
import { useFetcher } from "@remix-run/react";

const Track = React.forwardRef(
  ({ track, focusWithinTrack, clickFocusWithinTrack, ...props }, ref) => {
    const { trackRef, buttonRef } = useRefs(ref);
    const { moveUp, moveDown } = useFetchers(trackRef);

    const onButtonClick = (button) => (event) => {
      event.stopPropagation();
      clickFocusWithinTrack({ track: track.id, button });
    };

    return (
      <li id={track.id} ref={trackRef} {...props}>
        <div>
          <div>{track.name}</div>
          <div>
            <moveUp.Form method="post" action="_api/moveTrackUp">
              <button
                tabIndex={-1}
                ref={focusWithinTrack === "up" ? buttonRef : null}
                onClick={onButtonClick("up")}
                name="trackId"
                value={track.id}
              >
                Move up
              </button>
            </moveUp.Form>
          </div>
          <div>
            <moveDown.Form method="post" action="_api/moveTrackDown">
              <button
                tabIndex={-1}
                ref={focusWithinTrack === "down" ? buttonRef : null}
                onClick={onButtonClick("down")}
                name="trackId"
                value={track.id}
              >
                Move down
              </button>
            </moveDown.Form>
          </div>
        </div>
      </li>
    );
  }
);

const useFetchers = (trackRef) => {
  const moveUp = useFetcher();
  const moveDown = useFetcher();

  React.useEffect(() => {
    moveUp.type === "done" &&
      trackRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [moveUp, trackRef]);

  React.useEffect(() => {
    moveDown.type === "done" &&
      trackRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [moveDown, trackRef]);

  return { moveUp, moveDown };
};

const useRefs = (ref) => {
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

  return { trackRef, buttonRef };
};

export default Track;
