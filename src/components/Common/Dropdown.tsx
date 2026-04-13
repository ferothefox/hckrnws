import type { ReactNode } from "react";
import { DropdownMenu } from "radix-ui";

type DropdownItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  kbd?: string;
};

type DropdownProps = {
  items: DropdownItem[];
  triggerLabel: ReactNode;
  handleOnClick: (id: string) => void;
  selectedId?: string;
};

export default function Dropdown({
  items,
  triggerLabel,
  selectedId,
  handleOnClick,
}: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="border-primary bg-secondary hover:bg-tertiary max-w-[156px] cursor-pointer rounded-sm border px-2 py-1 font-sans text-sm outline-hidden duration-150 focus-visible:ring-1 focus-visible:ring-blue-500"
          aria-label="Open story sections"
        >
          {triggerLabel}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-primary border-primary w-32 rounded-md border p-0.5 shadow-xs"
          sideOffset={4}
          align="end"
        >
          {items.map((item) => (
            <DropdownMenu.Item
              key={item.id}
              className={`hover:bg-secondary group hover:text-primary mb-0.5 flex cursor-pointer items-center rounded px-2 py-1.5 text-sm ring-0 outline-hidden ${
                selectedId === item.id
                  ? "text-primary bg-secondary"
                  : "text-secondary bg-transparent"
              }`}
              onClick={() => handleOnClick(item.id)}
            >
              {item.icon}
              {item.label}{" "}
              <span className="text-tertiary ml-auto text-xs font-normal">
                {item.kbd}
              </span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
