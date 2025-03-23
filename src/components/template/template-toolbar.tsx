"use client";

import { useEmailTemplateStore } from "@/lib/email-template-store";
import {
  IconDeviceDesktop,
  IconDeviceMobile,
  IconCode,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconTrashFilled,
} from "@tabler/icons-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

const saveOptions = [
  {
    label: "Save template",
    description: "Save this template for later use",
  },
  {
    label: "Save and publish",
    description: "Publish this template to the web",
  },
  {
    label: "Export template",
    description: "Export this template to a file",
  },
];
export function TemplateToolbar() {
  const { undo, redo, viewMode, name, history, switchViewMode, resetTemplate } =
    useEmailTemplateStore();
  const [selectedSaveIdx, setSelectedSaveIdx] = React.useState(0);

  return (
    <section className="flex items-center justify-between gap-3 border-b p-2">
      <div className="flex items-center justify-between">
        <div className="">
          <span className="font-medium">{name}</span>
        </div>
      </div>

      <div className="flex items-center">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(val) =>
            switchViewMode(val as "desktop" | "mobile" | "code")
          }
        >
          <ToggleGroupItem value="desktop">
            <IconDeviceDesktop className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="mobile">
            <IconDeviceMobile className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="code">
            <IconCode className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            disabled={history.past?.length < 1}
            onClick={undo}
          >
            <IconArrowBackUp className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            disabled={history.future.length < 1}
            onClick={redo}
          >
            <IconArrowForwardUp className="h-4 w-4" />
          </Button>
        </div>
        <Separator orientation="vertical" />
        <Button
          type="button"
          size="icon"
          className="h-8 w-8"
          variant="destructive"
          onClick={resetTemplate}
        >
          <IconTrashFilled className="h-4 w-4" />
        </Button>
        <div className="inline-flex divide-x divide-primary-foreground/30 rounded-md shadow-xs rtl:space-x-reverse">
          <Button
            size="sm"
            className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
          >
            {saveOptions[Number(selectedSaveIdx)].label}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="h-8 w-8 rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
                size="icon"
                aria-label="Options"
              >
                <ChevronDownIcon size={16} aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="max-w-64 md:max-w-xs"
              side="bottom"
              sideOffset={4}
              align="end"
            >
              <DropdownMenuRadioGroup
                value={selectedSaveIdx}
                onValueChange={setSelectedSaveIdx}
              >
                {saveOptions.map((option, index) => (
                  <DropdownMenuRadioItem
                    key={option.label}
                    value={String(index)}
                    className="items-start [&>span]:pt-1.5"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-sm">
                        {option.label}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {option.description}
                      </span>
                    </div>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </section>
  );
}
