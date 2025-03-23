"use client";

import { useEmailTemplateStore } from "@/lib/email-template-store";

export function Typography() {
  const { updateElement } = useEmailTemplateStore();
  return (
    <div>
      <h4>Typography</h4>
    </div>
  );
}
