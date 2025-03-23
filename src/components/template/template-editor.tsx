"use client";
import {
  type EmailComponentType,
  useEmailTemplateStore,
} from "@/lib/email-template-store";
import { TemplateComponentList } from "./template-component-list";
import { TemplateComponentProperties } from "./template-component-properties";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import React from "react";
import { EmailComponentPreview } from "./email-component";
import { createPortal } from "react-dom";
import { TemplateCodeview } from "./template-codeview";
import { TemplateCanvas } from "./template-canvas";

export function TemplateEditor() {
  const { addElement, components, selectElement, reorderElement, viewMode } =
    useEmailTemplateStore();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeComponent, setActiveComponent] =
    React.useState<EmailComponentType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  function handleDragStart(evt: DragStartEvent) {
    const { active } = evt;
    setActiveId(active.id as string);
    // selectElement(active.id as string);

    // If it's a new component being dragged from the sidebar
    if (active.id.toString().startsWith("new-")) {
      const componentType = active.id
        .toString()
        .replace("new-", "") as EmailComponentType;
      setActiveComponent(componentType);
    } else {
      // If it's an existing component being reordered
      selectElement(active.id as string);
    }
  }
  function handleDragOver(evt: DragOverEvent) {
    const { active, over } = evt;
    if (
      over &&
      active.id !== over.id &&
      !active.id.toString().startsWith("new-")
    ) {
      const oldIndex = components.findIndex((item) => item.id === active.id);
      const newIndex = components.findIndex((item) => item.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderElement(oldIndex, newIndex);
      }
    }
    // if (over && active.id !== over.id) {
    //   const oldIndex = components.findIndex((item) => item.id === active.id);
    //   const newIndex = components.findIndex((item) => item.id === over.id);
    //   reorderElement(oldIndex, newIndex);
    // }
  }
  function handleDragEnd(evt: DragEndEvent) {
    setActiveId(null);
    setActiveComponent(null);
    const { active, over } = evt;
    if (!over) {
      return;
    }

    // Handle dropping new components to canvas from sidebar
    if (active.id.toString().startsWith("new-")) {
      const componentType = active.id
        .toString()
        .replace("new-", "") as EmailComponentType;
      if (over) {
        // If dropped on an existing component, add before/after it
        if (over.id !== "canvas") {
          const overIndex = components.findIndex((item) => item.id === over.id);
          addElement(
            componentType,
            overIndex !== -1 ? overIndex + 1 : components.length
          );
        } else {
          // If dropped on the canvas directly, add at the end
          addElement(componentType);
        }
      } else if (over === null && components.length === 0) {
        // If canvas is empty and dropped anywhere within it
        addElement(componentType);
      }
    }
  }

  if (viewMode === "code") {
    return <TemplateCodeview />;
  }

  return (
    <DndContext
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <section className="z-0 grid flex-1 grid-cols-[240px_1fr_300px]">
        <TemplateComponentList />
        <section className="w-full bg-neutral-800 h-[inherit">
          <TemplateCanvas />
        </section>

        <TemplateComponentProperties />
        {typeof window !== "undefined" &&
          createPortal(
            <DragOverlay>
              {activeId && activeComponent && (
                <div className="-rotate-6 pointer-events-none rounded-md border-2 border-primary border-dashed bg-white p-1 shadow-md">
                  <EmailComponentPreview type={activeComponent} />
                </div>
              )}
              {activeId &&
                !activeComponent &&
                components.find((c) => c.id === activeId) && (
                  <div className="pointer-events-none rounded-md border-2 border-primary border-dashed bg-white p-4 shadow-md">
                    {/* Render the actual component being dragged */}
                    {components.find((c) => c.id === activeId)?.content ||
                      "Component"}
                  </div>
                )}
            </DragOverlay>,
            document.body
          )}
      </section>
    </DndContext>
  );
}
