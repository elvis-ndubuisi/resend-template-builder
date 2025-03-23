"use client";

import type { EmailComponentType } from "@/lib/email-template-store";
import { IconClick, IconPhoto, IconTextCaption } from "@tabler/icons-react";
import type React from "react";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { ColumnMaker } from "./email-component";

const componentsList: Record<
  "blocks" | "content" | "layout",
  {
    title: string;
    icon: React.ElementType;
    type: EmailComponentType;
  }[]
> = {
  blocks: [
    // { title: '', type: '', icon: '' },
    // { title: '', type: '', icon: '' },
    // { title: '', type: '', icon: '' },
  ],
  content: [
    { title: "Text", type: "text", icon: IconTextCaption },
    { title: "Button", type: "button", icon: IconClick },
    { title: "Image", type: "image", icon: IconPhoto },
    { title: "Divider", type: "divider", icon: IconPhoto },
  ],
  layout: [
    {
      title: "Column",
      type: "column",
      icon: () => ColumnMaker({ len: 1 }),
    },
    {
      title: "2 Column",
      type: "2-column",
      icon: () => ColumnMaker({ len: 2 }),
    },
    {
      title: "3 Column",
      type: "3-column",
      icon: () => ColumnMaker({ len: 3 }),
    },
    {
      title: "4 Column",
      type: "4-column",
      icon: () => ColumnMaker({ len: 4 }),
    },
  ],
};

function DraggableItem({
  type,
  children,
}: React.PropsWithChildren<{ type: EmailComponentType }>) {
  const { isDragging, listeners, setNodeRef, attributes } = useDraggable({
    id: `new-${type}`,
    // data: { type: type, isNew: true },
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "w-auto",
        isDragging ? "cursor-grabbing opacity-30" : "cursor-grab"
      )}
      type="button"
    >
      {children}
    </button>
  );
}

export function TemplateComponentList() {
  return (
    <aside className="space-y-4 border-r p-2">
      <div>
        <h3 className="font-medium">Blocks</h3>
      </div>
      <div>
        <h3 className="mb-2 font-medium">Content</h3>
        <div className="grid grid-cols-3 gap-2">
          {componentsList.content.map((comp) => (
            <DraggableItem key={comp.title} type={comp.type}>
              <div className="flex flex-col items-center space-y-2 rounded-md border p-1 hover:ring-1">
                <comp.icon className="h-8 w-8" />
                <span className="font-medium text-xs">{comp.title}</span>
              </div>
            </DraggableItem>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 font-medium">Layouts</h3>
        <div className="flex flex-col space-y-1">
          {componentsList.layout.map((comp) => (
            <DraggableItem key={comp.title} type={comp.type}>
              <comp.icon />
            </DraggableItem>
          ))}
        </div>
      </div>
    </aside>
  );
}
