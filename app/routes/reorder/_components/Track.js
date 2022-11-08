import * as React from "react";
import { useFetcher } from "@remix-run/react";

import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import { VisuallyHidden } from "@reach/visually-hidden";
import { motion } from "framer-motion";

const Track = React.forwardRef(
  ({ track, focusWithinTrack, clickFocusWithinTrack, ...props }, ref) => {
    const { trackRef, buttonRef } = useRefs(ref);
    const { moveUp, moveDown } = useFetchers(trackRef);

    const onButtonClick = (button) => (event) => {
      event.stopPropagation();
      clickFocusWithinTrack({ track: track.id, button });
    };

    const buttonProps = { track, focusWithinTrack, onButtonClick, buttonRef };

    return (
      <motion.li id={track.id} ref={trackRef} {...props} layout="position">
        <div>
          <div className="track-name">{track.name}</div>
          <div>
            <moveUp.Form method="post" action="_api/moveTrackUp">
              <Button direction="up" icon={ArrowUpIcon} {...buttonProps} />
            </moveUp.Form>
          </div>
          <div>
            <moveDown.Form method="post" action="_api/moveTrackDown">
              <Button direction="down" icon={ArrowDownIcon} {...buttonProps} />
            </moveDown.Form>
          </div>
        </div>
      </motion.li>
    );
  }
);

const Button = ({
  track,
  focusWithinTrack,
  onButtonClick,
  buttonRef,
  direction,
  icon: Icon,
  ...props
}) => (
  <button
    tabIndex={-1}
    ref={focusWithinTrack === direction ? buttonRef : null}
    onClick={onButtonClick(direction)}
    name="trackId"
    value={track.id}
    {...props}
  >
    <VisuallyHidden>{`Move ${track.name} ${direction}`}</VisuallyHidden>
    <Icon aria-hidden focusable={false} />
  </button>
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
