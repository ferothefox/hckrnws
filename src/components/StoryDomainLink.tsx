"use client";

import { Tooltip } from "radix-ui";

type StoryDomainLinkProps = {
  url: string;
  domain: string;
  className?: string;
  tooltipClassName?: string;
};

const defaultLinkClassName =
  "text-xs font-normal mb-0.5 border-b border-primary font-mono text-secondary mt-0.5 focus-visible:ring-1 focus-visible:ring-blue-500 hover:text-primary";

const defaultTooltipClassName =
  "text-xs z-50 border p-1 rounded-md border-primary bg-secondary whitespace-nowrap font-normal mb-0.5 border-b w-fit font-mono text-secondary";

export default function StoryDomainLink({
  url,
  domain,
  className = defaultLinkClassName,
  tooltipClassName = defaultTooltipClassName,
}: StoryDomainLinkProps) {
  return (
    <Tooltip.Root delayDuration={50}>
      <Tooltip.Trigger asChild>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          aria-label={`Open ${domain}`}
        >
          ({domain})
        </a>
      </Tooltip.Trigger>
      <Tooltip.Content side="right" sideOffset={8} className={tooltipClassName}>
        {url}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
