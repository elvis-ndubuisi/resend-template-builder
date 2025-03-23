"use client";

import type {
  EmailComponent,
  EmailComponentType,
} from "@/lib/email-template-store";
import { Button, Heading, Hr, Img, Text } from "@react-email/components";
import {
  IconPhoto,
  IconTextCaption,
  IconHeading,
  IconCode,
  IconLink,
  IconSeparator,
} from "@tabler/icons-react";

export function renderEmailComponent({
  component,
}: {
  component: EmailComponent;
}) {
  switch (component?.type) {
    case "image":
      return (
        <Img
          src={component.src || ""}
          alt={component.content || ""}
          style={component.style}
          width={component.style?.width}
          height={component.style?.height}
        />
      );

    case "heading":
      return (
        <Heading style={component.style} as={component.as || "h1"}>
          {component?.content}
        </Heading>
      );

    case "text":
      return <Text style={component.style}>{component.content || ""}</Text>;

    case "button":
      return (
        <Button style={component.style} href={component.href || "#"}>
          {component.content}
        </Button>
      );

    case "divider":
      return <Hr style={component.style} />;

    default:
      return null;
  }
}

export function EmailComponentPreview({ type }: { type: EmailComponentType }) {
  switch (type) {
    case "button":
      return (
        <div className="flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-white">
          Button
        </div>
      );
    case "heading":
      return <IconHeading className="h-6 w-6" />;
    case "text":
      return <IconTextCaption className="h-6 w-6" />;
    case "image":
      return <IconPhoto className="h-6 w-6" />;
    case "codeblock":
      return <IconCode className="h-6 w-6" />;
    case "codeinline":
      return <IconCode className="h-6 w-6" />;
    case "link":
      return <IconLink className="h-6 w-6" />;
    case "divider":
      return <IconSeparator className="h-6 w-6" />;
    case "container":
      return (
        <div className="h-10 w-full rounded border border-gray-300 border-dashed">
          container
        </div>
      );
    case "column":
      return ColumnMaker({ len: 1 });
    case "2-column":
      return ColumnMaker({ len: 2 });
    case "3-column":
      return ColumnMaker({ len: 3 });
    case "4-column":
      return ColumnMaker({ len: 4 });
    default:
      return <div>Unknown Component</div>;
  }
}

export function ColumnMaker({ len }: { len: number }) {
  return (
    <div className="flex gap-1 rounded border border-blue-400 p-1">
      {Array.from({ length: len }).map((_, i) => (
        <div key={i} className="flex-1 rounded bg-gray-200 p-3.5" />
      ))}
    </div>
  );
}
