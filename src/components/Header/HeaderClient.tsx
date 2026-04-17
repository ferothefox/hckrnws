"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  AskHNIcon,
  ClockIcon,
  MoonIcon,
  ShowHNIcon,
  StarIcon,
  SunIcon,
  TopHNIcon,
} from "@/icons";
import Dropdown from "@/components/Common/Dropdown";
import { useHydrated } from "@/hooks/useHydrated";
import { useKeyPress } from "@/hooks/useKeyPress";

const dropdownItems = [
  {
    label: "Top",
    id: "top",
    icon: (
      <TopHNIcon className="text-icon group-hover:text-primary mr-2 h-4 w-4" />
    ),
    kbd: "T",
  },
  {
    label: "Show",
    id: "show",
    icon: (
      <ShowHNIcon className="text-icon group-hover:text-primary mr-2 h-4 w-4" />
    ),
    kbd: "S",
  },
  {
    label: "New",
    id: "new",
    icon: (
      <ClockIcon className="text-icon group-hover:text-primary mr-2 h-4 w-4" />
    ),
    kbd: "N",
  },
  {
    label: "Ask",
    id: "ask",
    icon: (
      <AskHNIcon className="text-icon group-hover:text-primary mr-2 h-4 w-4" />
    ),
    kbd: "A",
  },
  {
    label: "Starred",
    id: "star",
    icon: (
      <StarIcon className="text-icon group-hover:text-primary mr-2 h-4 w-4" />
    ),
    kbd: "X",
  },
] as const;

function getSectionPath(id: string) {
  return id === "star" ? "/star" : `/${id}/1`;
}

export default function HeaderClient() {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();

  useKeyPress("t", () => router.push("/top/1"));
  useKeyPress("s", () => router.push("/show/1"));
  useKeyPress("n", () => router.push("/new/1"));
  useKeyPress("a", () => router.push("/ask/1"));
  useKeyPress("x", () => router.push("/star"));

  const currentSection = pathname?.split("/")[1];
  const selectedItem = dropdownItems.find((item) => item.id === currentSection);

  const themeIcon = hydrated ? (
    resolvedTheme === "dark" ? (
      <SunIcon className="text-icon h-4 w-4" />
    ) : (
      <MoonIcon className="text-icon h-4 w-4" />
    )
  ) : (
    <span className="block h-4 w-4" aria-hidden="true" />
  );

  return (
    <div className="flex items-center">
      <Dropdown
        items={[...dropdownItems]}
        triggerLabel={
          <div className="flex items-center">
            {selectedItem?.icon}
            <span className="text-primary text-sm font-medium">
              {selectedItem?.label ?? "Go to"}
            </span>
          </div>
        }
        selectedId={selectedItem?.id}
        handleOnClick={(id) => router.push(getSectionPath(id))}
      />
      <button
        className="border-primary bg-secondary hover:bg-tertiary ml-2 cursor-pointer rounded-sm border p-1.5 duration-150 focus-visible:ring-1 focus-visible:ring-blue-500"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        type="button"
        aria-label="Toggle Theme"
      >
        {themeIcon}
      </button>
    </div>
  );
}
