import { prettyTime } from "~/helpers/time";
import { useEffect, useState } from "react";
import { ClockIcon, CommentIcon, UpvoteIcon } from "~/icons";

type Props = {
  points: number;
  comments: number;
  time: number;
  id?: number;
  user: string;
  url: string;
  isDetailedView?: boolean;
};

const Meta: React.FC<Props> = ({
  points,
  comments,
  time,
  isDetailedView = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <div className={`${isDetailedView ? "h-[24px]" : "h-[28px]"}`}></div>
    );

  return (
    <div
      className={`flex justify-between w-full ${
        isDetailedView ? "mt-0" : "mt-1"
      }`}
    >
      <div className="flex items-center">
        <div
          className="fadein-animation flex items-center mr-2 p-1 pl-0"
          style={{ "--fadein-delay": "0s" } as React.CSSProperties}
        >
          <UpvoteIcon className="h-3 w-3 text-icon" />
          <span className="text-xs ml-1 text-secondary font-sans">
            {points}
          </span>
        </div>
        <div
          className="fadein-animation flex items-center mr-2 p-1 pl-0"
          style={{ "--fadein-delay": "0.02s" } as React.CSSProperties}
        >
          <CommentIcon className="h-3 w-3 text-icon" />
          <span className="text-xs ml-1 text-secondary font-sans">
            {comments}
          </span>
        </div>
        <div
          className="fadein-animation flex items-center mr-2 p-1 pl-0"
          style={{ "--fadein-delay": "0.04s" } as React.CSSProperties}
        >
          <ClockIcon className="h-3 w-3 text-icon" />
          <span className="text-xs ml-1 text-secondary font-sans">
            {prettyTime(time)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Meta;
