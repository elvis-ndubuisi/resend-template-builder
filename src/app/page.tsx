"use client";

import { TemplateEditor } from "@/components/template/template-editor";
import { TemplateToolbar } from "@/components/template/template-toolbar";

export default function Page() {
  return (
    <main className="flex size-full flex-col h-screen">
      <TemplateToolbar />
      <TemplateEditor />
    </main>
  );
}
