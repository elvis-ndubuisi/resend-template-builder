"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChromePicker } from "react-color";
import React from "react";
import { useEmailTemplateStore } from "@/lib/email-template-store";
export function BodyProps() {
  const { updateCanvasStyle, canvasStyle } = useEmailTemplateStore();
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [colorProperty, setColorProperty] = React.useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="bg-color">Background Color</Label>
        <div className="mt-1 flex items-center">
          <div
            className="mr-2 h-8 w-8 cursor-pointer rounded border"
            style={{
              backgroundColor: canvasStyle.backgroundColor || "#ffffff",
            }}
            onClick={() => {
              setColorProperty("backgroundColor");
              setShowColorPicker(!showColorPicker);
            }}
          />
          <Input
            id="bg-color"
            value={canvasStyle.backgroundColor || "#ffffff"}
            onChange={(e) =>
              updateCanvasStyle({ backgroundColor: e.target.value })
            }
          />
        </div>
        {showColorPicker && colorProperty === "backgroundColor" && (
          <div className="absolute z-10 mt-2">
            <div
              className="fixed inset-0"
              onClick={() => setShowColorPicker(false)}
            />
            <ChromePicker
              color={canvasStyle.backgroundColor || "#ffffff"}
              onChange={(color) =>
                updateCanvasStyle({ backgroundColor: color.hex })
              }
            />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="text-color">Text Color</Label>
        <div className="mt-1 flex items-center">
          <div
            className="mr-2 h-8 w-8 cursor-pointer rounded border"
            style={{ backgroundColor: canvasStyle.textColor || "#000000" }}
            onClick={() => {
              setColorProperty("textColor");
              setShowColorPicker(!showColorPicker);
            }}
          />
          <Input
            id="text-color"
            value={canvasStyle.textColor || "#000000"}
            onChange={(e) => updateCanvasStyle({ textColor: e.target.value })}
          />
        </div>
        {showColorPicker && colorProperty === "textColor" && (
          <div className="absolute z-10 mt-2">
            <div
              className="fixed inset-0"
              onClick={() => setShowColorPicker(false)}
            />
            <ChromePicker
              color={canvasStyle.textColor || "#000000"}
              onChange={(color) => updateCanvasStyle({ textColor: color.hex })}
            />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="font-family">Font Family</Label>
        <Select
          value={canvasStyle.fontFamily || "Arial, sans-serif"}
          onValueChange={(value) => updateCanvasStyle({ fontFamily: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select font family" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial, sans-serif">Arial</SelectItem>
            <SelectItem value="'Times New Roman', serif">
              Times New Roman
            </SelectItem>
            <SelectItem value="'Courier New', monospace">
              Courier New
            </SelectItem>
            <SelectItem value="Georgia, serif">Georgia</SelectItem>
            <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="width">Width (px)</Label>
        <Input
          id="width"
          type="number"
          value={canvasStyle.width || 600}
          onChange={(e) => updateCanvasStyle({ width: Number(e.target.value) })}
        />
      </div>

      <div>
        <Label htmlFor="padding">Padding (px)</Label>
        <Input
          id="padding"
          type="number"
          value={canvasStyle.padding || 0}
          onChange={(e) =>
            updateCanvasStyle({ padding: Number(e.target.value) })
          }
        />
      </div>
    </div>
  );
}
