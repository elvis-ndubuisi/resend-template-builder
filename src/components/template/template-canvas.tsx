"use client";
import {
  type EmailComponent,
  useEmailTemplateStore,
} from "@/lib/email-template-store";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type React from "react";
import { renderEmailComponent } from "./email-component";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { CSS } from "@dnd-kit/utilities";

function SortableComponent({
  children,
  component,
}: React.PropsWithChildren<{ component: EmailComponent }>) {
  const { selectElement, selectedElement, removeElement } =
    useEmailTemplateStore();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: component?.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border:
      component?.id === selectedElement?.id ? "2px dashed #3b82f6" : "none",
    position: "relative" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        selectElement(component?.id);
      }}
      className="group relative cursor-pointer hover:outline hover:outline-blue-200"
    >
      {/* <div className="-top-3 absolute z-30 hidden w-full items-center justify-between group-focus-within:flex group-focus:flex">
        <span className="font-medium text-xs" />

        <div className="flex items-center gap-3 bg-lime-500">
          <button
            type="button"
            onClick={() => removeElement(component.id)}
            className="cursor-pointer"
          >
            <IconTrash className="h-4 w-4 text-white" />
          </button>
        </div>
      </div> */}
      {children}
      {component?.id === selectedElement?.id && (
        <div className="absolute top-0 right-0 bg-blue-500 px-1 text-white text-xs">
          {component?.type}
        </div>
      )}
    </div>
  );
}
export function TemplateCanvas() {
  const { components, canvasStyle, selectElement, viewMode } =
    useEmailTemplateStore();
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  return (
    <section
      className={cn(
        "mx-auto w-full h-full transition-all duration-300 ease-in-out",
        viewMode === "mobile" ? "max-w-[375px]" : "max-w-[800px]",
        isOver && "border-2 border-blue-600 border-dashed"
      )}
      style={canvasStyle}
      ref={setNodeRef}
      onClick={(evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        selectElement();
      }}
    >
      <SortableContext
        strategy={verticalListSortingStrategy}
        items={components?.map((c) => c?.id)}
      >
        {components?.map((comp) => (
          <SortableComponent component={comp} key={comp?.id}>
            {renderEmailComponent({ component: comp })}
          </SortableComponent>
        ))}
      </SortableContext>
    </section>
  );
}
