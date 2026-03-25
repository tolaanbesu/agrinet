"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export function DirectUpload() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("document", file);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.refresh(); 
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="text-sm text-primary underline hover:text-primary/80 disabled:text-muted-foreground"
      >
        {loading ? "Uploading..." : "Upload / Update Document"}
      </button>
    </div>
  );
}