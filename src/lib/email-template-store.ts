import { arrayMove } from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import type React from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type EmailComponentType =
  | "container"
  | "button"
  | "heading"
  | "text"
  | "codeblock"
  | "image"
  | "codeinline"
  | "divider"
  | "link"
  | "column"
  | "2-column"
  | "3-column"
  | "4-column";

type CanvasStyle = {
  backgroundColor: string;
  padding?: string;
  fontFamily?: string;
  textColor?: string;
  width?: number;
  [key: string]: unknown;
};

export interface EmailComponent {
  id: string;
  type: EmailComponentType;
  content?: string;
  placeholder?: string;
  style: React.CSSProperties;
  href?: string;
  src?: string;
  alt?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5";
}

type TemplateState = {
  name?: string;
  components: EmailComponent[];
  history: {
    past: {
      components: EmailComponent[];
      canvasStyle: CanvasStyle;
      placeholders: Array<{ key: string; description: string }>;
    }[];
    future: {
      components: EmailComponent[];
      canvasStyle: CanvasStyle;
      placeholders: Array<{ key: string; description: string }>;
    }[];
  };
  placeholders: Array<{ key: string; description: string }>;
  viewMode: "desktop" | "mobile" | "code";
  selectedElement?: EmailComponent;
  canvasStyle: CanvasStyle;
};

type TemplateActions = {
  undo: () => void;
  redo: () => void;
  saveSnapshot: () => void;
  switchViewMode: (mode: "desktop" | "code" | "mobile") => void;
  addElement: (type: EmailComponentType, position?: number) => void;
  reorderElement: (oldIdx: number, newIdx: number) => void;
  removeElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  addPlaceholder: (placeholder: { key: string; description: string }) => void;
  removePlaceholder: (key: string) => void;
  loadTemplate: (template: TemplateState) => void;
  updateElement: (id: string, updates: Partial<EmailComponent>) => void;
  selectElement: (id?: string) => void;
  updateCanvasStyle: (updates: Partial<CanvasStyle>) => void;
  resetTemplate: () => void;
  setName: (name: string) => void;
};

const defaultTemplate: TemplateState = {
  name: "Untitled Template",
  components: [],
  history: { future: [], past: [] },
  placeholders: [],
  viewMode: "desktop",
  selectedElement: undefined,
  canvasStyle: {
    backgroundColor: "#1c1919",
    padding: "10px",
  },
};

export const useEmailTemplateStore = create<TemplateState & TemplateActions>()(
  persist(
    (set, get) => ({
      name: "Untitled Template",
      subject: undefined,
      components: [],
      placeholders: [],
      history: { future: [], past: [] },
      viewMode: "desktop",
      selectedElement: undefined,
      canvasStyle: {
        backgroundColor: "#1c1919",
        padding: "10px",
      },

      redo() {
        set((state) => {
          // If there's nothing to redo, return early
          if (state.history.future.length === 0) {
            return state;
          }

          // Get the next state from future (only shift once!)
          const nextFuture = [...state.history.future];
          const next = nextFuture.shift();
          if (!next) {
            return state;
          }

          // Save current state to past
          const newPast = [
            ...state.history.past,
            {
              canvasStyle: { ...state.canvasStyle },
              components: [...state.components],
              placeholders: [...state.placeholders],
            },
          ];
          // Restore the next state
          return {
            ...state,
            components: [...next.components],
            canvasStyle: { ...next.canvasStyle },
            placeholders: [...next.placeholders],
            history: {
              past: newPast,
              future: nextFuture,
            },
          };
        });
      },
      undo() {
        set((state) => {
          // Return if no undo.
          if (state.history.past.length === 0) {
            return state;
          }
          const newPast = [...state.history.past];
          const previous = newPast.pop();
          if (!previous) {
            return state;
          }
          const newFuture = [
            {
              components: [...state.components],
              canvasStyle: { ...state.canvasStyle },
              placeholders: [...state.placeholders],
            },
            ...state.history.future,
          ];

          return {
            ...state,
            components: [...previous.components],
            canvasStyle: { ...previous.canvasStyle },
            placeholders: [...previous.placeholders],
            history: {
              past: newPast,
              future: newFuture,
            },
          };
        });
      },
      saveSnapshot() {
        set((state) => ({
          history: {
            future: [],
            past: [
              {
                canvasStyle: { ...state.canvasStyle },
                components: JSON.parse(JSON.stringify(state.components)),
                placeholders: [...state.placeholders],
              },
              ...state.history.past,
            ],
          },
        }));
      },
      switchViewMode(mode) {
        set({ viewMode: mode });
      },

      addElement(type, position) {
        const newComponent: EmailComponent = {
          id: nanoid(),
          type: type,
          style: {},
        };

        // Setting default config/styles
        switch (type) {
          case "button":
            newComponent.href = "#";
            newComponent.content = "Button";
            newComponent.style = {
              backgroundColor: "#5e6ad2",
              borderRadius: "3px",
              fontWeight: "600",
              color: "#fff",
              fontSize: "15px",
              textDecoration: "none",
              textAlign: "center" as const,
              display: "block",
              padding: "11px 23px",
            };
            break;

          case "heading":
            newComponent.content = "Title";
            newComponent.as = "h1";
            break;

          case "text":
            newComponent.style = {
              fontSize: "14px",
              color: "#000000",
            };
            newComponent.content = "Add your text here";
            break;

          case "divider":
            newComponent.style.borderColor = "#dfe1e4";
            break;

          case "image":
            newComponent.src = "";
            newComponent.alt = "Image description";
            newComponent.style = {
              width: "100%",
            };
            break;

          case "container":
            newComponent.style = {
              margin: "0 auto",
              padding: "20px 0 48px",
              maxWidth: "560px",
            };
            break;

          case "link":
            newComponent.href = "#";
            newComponent.content = "Link";
            newComponent.style = {
              color: "#5e6ad2",
              textDecoration: "underline",
            };
            break;

          case "codeblock":
            newComponent.content = "Code Block";
            newComponent.style = {
              backgroundColor: "#f6f8fa",
              borderRadius: "3px",
              fontSize: "13px",
              lineHeight: "1.4",
              overflowWrap: "break-word",
              wordWrap: "break-word",
              hyphens: "auto",
              padding: "16px",
            };
            break;

          case "column":
            newComponent.style = {
              padding: "10px",
              width: "50%",
            };
            break;

          default:
            break;
        }
        // Insert at specific index or append to the end
        set((state) => {
          let newComponents = [...state.components];

          if (
            position !== undefined &&
            position >= 0 &&
            position <= newComponents.length
          ) {
            // Insert at position
            newComponents.splice(position, 0, newComponent);
          } else {
            // Append to end
            newComponents = [...newComponents, newComponent];
          }

          return { components: newComponents };
        });
        // set((state) => ({
        //   components:
        //     position !== undefined &&
        //     position >= 0 &&
        //     position <= state.components.length
        //       ? state.components.splice(position, 0, newComponent)
        //       : [...state.components, newComponent],
        // }));
        get().saveSnapshot();
      },
      reorderElement(oldIdx, newIdx) {
        set((state) => ({
          components: arrayMove(state.components, oldIdx, newIdx),
        }));
        get().saveSnapshot();
      },
      removeElement(id) {
        set((state) => ({
          components: state.components?.filter((c) => c.id !== id),
        }));
        get().saveSnapshot();
      },
      duplicateElement(id) {
        set((state) => {
          const compToDuplicate = state.components.find((c) => c.id === id);
          if (compToDuplicate) {
            const newComponent = { ...compToDuplicate, id: nanoid() };
            return { components: [...state.components, newComponent] };
          }
          return state;
        });
      },
      updateElement(id, updates) {
        // const index = state.components.findIndex((c) => c.id === id);
        // if (index !== -1) {
        //   state.components[index] = { ...state.components[index], ...updates }
        // }
        set((state) => {
          const index = state.components.findIndex((c) => c.id === id);
          if (index !== -1) {
            state.components[index] = {
              ...state.components[index],
              ...updates,
            };
          }
          return state;
        });
        get().saveSnapshot();
      },
      selectElement(id) {
        set((state) => ({
          selectedElement: id
            ? state.components.find((c) => c.id === id)
            : undefined,
        }));
      },
      updateCanvasStyle(updates) {
        set((state) => ({
          canvasStyle: { ...state.canvasStyle, ...updates },
        }));
        get().saveSnapshot();
      },
      resetTemplate() {
        set({
          ...defaultTemplate,
        });
      },
      setName(name) {
        set({ name });
      },
      addPlaceholder(placeholder) {
        set((state) => ({
          placeholders: [...state.placeholders, placeholder],
        }));
        get().saveSnapshot();
      },
      removePlaceholder(key) {
        set((state) => ({
          placeholders: state.placeholders.filter((p) => p.key !== key),
        }));
        get().saveSnapshot();
      },
      loadTemplate(template) {
        set({
          ...template,
          history: { future: [], past: [] },
        });
      },
    }),
    {
      name: "email-template",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
