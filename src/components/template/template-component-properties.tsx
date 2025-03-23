"use client";

import {
  type EmailComponent,
  useEmailTemplateStore,
} from "@/lib/email-template-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BodyProps } from "./properties/body-props";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChromePicker } from "react-color";
import React from "react";

export function TemplateComponentProperties() {
  const { selectedElement, updateElement, canvasStyle } =
    useEmailTemplateStore();
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [colorProperty, setColorProperty] = React.useState<string | null>(null);

  const handlePropertyChange = (property: string, value: any) => {
    updateElement(selectedElement?.id!, { [property]: value });
  };

  return (
    <aside className="space-y-4 border-l p-2">
      <Tabs defaultValue="styles" className="items-center">
        <TabsList className="flex h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1 text-foreground">
          <TabsTrigger
            value="styles"
            className="after:-mb-1 relative flex-1 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:hover:bg-accent data-[state=active]:after:bg-primary"
          >
            Styles
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="after:-mb-1 relative flex-1 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:hover:bg-accent data-[state=active]:after:bg-primary"
          >
            Advanced
          </TabsTrigger>
        </TabsList>
        <TabsContent value="styles">
          {!selectedElement && <BodyProps />}
          {selectedElement && (
            <>
              {renderContentProperties(selectedElement, handlePropertyChange)}
              <div>
                <Label htmlFor="color">Text Color</Label>
                <div className="mt-1 flex items-center">
                  <div
                    className="mr-2 h-8 w-8 cursor-pointer rounded border"
                    style={{
                      backgroundColor:
                        selectedElement.style?.color || "#000000",
                    }}
                    onClick={() => {
                      setColorProperty("color");
                      setShowColorPicker(!showColorPicker);
                    }}
                  />
                  <Input
                    id="color"
                    value={selectedElement.style?.color || "#000000"}
                    onChange={(e) =>
                      handlePropertyChange("style", {
                        ...selectedElement.style,
                        color: e.target.value,
                      })
                    }
                  />
                </div>
                {showColorPicker && colorProperty === "color" && (
                  <div className="absolute z-10 mt-2">
                    <div
                      className="fixed inset-0"
                      onClick={() => setShowColorPicker(false)}
                    />
                    <ChromePicker
                      color={selectedElement.style?.color || "#000000"}
                      onChange={(color) =>
                        handlePropertyChange("style", {
                          ...selectedElement.style,
                          color: color.hex,
                        })
                      }
                    />
                  </div>
                )}
              </div>
            </>
          )}
          <p className="p-4 text-center text-muted-foreground text-xs">
            Content for Tab 1
          </p>
        </TabsContent>
        <TabsContent value="advanced">
          <p className="p-4 text-center text-muted-foreground text-xs">
            Content for Tab 2
          </p>
        </TabsContent>
      </Tabs>
      {!selectedElement && <div>body</div>}
      {selectedElement && <div>others</div>}
    </aside>
  );
}

function renderContentProperties(
  component: EmailComponent,
  handlePropertyChange: (property: string, value: any) => void
) {
  switch (component.type) {
    case "heading":
      return (
        <>
          <div>
            <Label htmlFor="heading-text">Heading Text</Label>
            <Input
              id="heading-text"
              value={component.content || ""}
              onChange={(e) => handlePropertyChange("content", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="heading-level">Heading Level</Label>
            <Select
              value={component.headingLevel?.toString() || "1"}
              onValueChange={(value) =>
                handlePropertyChange("headingLevel", Number(value))
              }
            >
              <SelectTrigger id="heading-level">
                <SelectValue placeholder="Select heading level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">H1</SelectItem>
                <SelectItem value="2">H2</SelectItem>
                <SelectItem value="3">H3</SelectItem>
                <SelectItem value="4">H4</SelectItem>
                <SelectItem value="5">H5</SelectItem>
                <SelectItem value="6">H6</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      );

    case "text":
      return (
        <div>
          <Label htmlFor="text-content">Text Content</Label>
          <Textarea
            id="text-content"
            value={component.content || ""}
            onChange={(e) => handlePropertyChange("content", e.target.value)}
            rows={5}
          />
        </div>
      );

    case "button":
      return (
        <>
          <div>
            <Label htmlFor="button-text">Button Text</Label>
            <Input
              id="button-text"
              value={component.content || ""}
              onChange={(e) => handlePropertyChange("content", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="button-url">Button URL</Label>
            <Input
              id="button-url"
              value={component.href || ""}
              onChange={(e) => handlePropertyChange("href", e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </>
      );

    case "image":
      return (
        <>
          <div>
            <Label htmlFor="image-src">Image URL</Label>
            <Input
              id="image-src"
              value={component.src || ""}
              onChange={(e) => handlePropertyChange("src", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <Label htmlFor="image-alt">Alt Text</Label>
            <Input
              id="image-alt"
              value={component.alt || ""}
              onChange={(e) => handlePropertyChange("alt", e.target.value)}
              placeholder="Image description"
            />
          </div>
          <div>
            <Label htmlFor="image-width">Width (px)</Label>
            <Input
              id="image-width"
              type="number"
              value={component.width || ""}
              onChange={(e) => handlePropertyChange("width", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="image-height">Height (px)</Label>
            <Input
              id="image-height"
              type="number"
              value={component.height || ""}
              onChange={(e) => handlePropertyChange("height", e.target.value)}
            />
          </div>
        </>
      );

    case "divider":
      return (
        <div>
          <Label htmlFor="divider-width">Width (%)</Label>
          {/* <Slider
            id="divider-width"
            defaultValue={[component.width ? Number(component.width) : 100]}
            max={100}
            step={1}
            onValueChange={(value) => handlePropertyChange("width", value[0] + "%")}
          /> */}
          <div className="mt-1 flex justify-between text-muted-foreground text-xs">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      );

    case "container":
    case "section":
      return (
        <div>
          <Label htmlFor="container-width">Width (px or %)</Label>
          <Input
            id="container-width"
            value={component.width || ""}
            onChange={(e) => handlePropertyChange("width", e.target.value)}
            placeholder="e.g. 100% or 600px"
          />
        </div>
      );

    default:
      return (
        <div className="text-muted-foreground">
          No editable properties available for this component type.
        </div>
      );
  }
}
