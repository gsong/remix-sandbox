import * as React from "react";
import { useFetcher } from "@remix-run/react";

import { VisuallyHidden } from "@reach/visually-hidden";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const Track = React.forwardRef(
  ({ track, focusWithinTrack, clickFocusWithinTrack, ...props }, ref) => {
    const { trackRef, buttonRef } = useRefs(ref);
    const { moveUp, moveDown } = useFetchers(trackRef);

    const onButtonClick = (button) => (event) => {
      event.stopPropagation();
      clickFocusWithinTrack({ track: track.id, button });
    };

    return (
      <motion.li id={track.id} ref={trackRef} {...props} layout="position">
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
                <VisuallyHidden>Move up</VisuallyHidden>
                <ArrowUpIcon aria-hidden focusable={false} />
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
                <VisuallyHidden>Move down</VisuallyHidden>
                <ArrowDownIcon aria-hidden focusable={false} />
              </button>
            </moveDown.Form>
          </div>
        </div>
      </motion.li>
    );
  }
);

const scrollIntoView = (type, node) => {
  type === "done" &&
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
};

const useFetchers = (trackRef) => {
  const moveUp = useFetcher();
  const moveDown = useFetcher();

  React.useEffect(() => {
    return scrollIntoView(
      moveUp.type,
      trackRef.current.previousSibling || trackRef.current
    );
  }, [moveUp, trackRef]);

  React.useEffect(() => {
    return scrollIntoView(
      moveDown.type,
      trackRef.current.nextSibling || trackRef.current
    );
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
