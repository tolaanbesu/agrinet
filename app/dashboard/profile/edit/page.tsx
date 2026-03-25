"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          location: data.location || "",
        });
        setRole(data.role);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phone", form.phone);
    formData.append("location", form.location);

    if (file) {
      formData.append("document", file);
    }

    await fetch("/api/profile", {
      method: "POST",
      body: formData,
    });

    router.push("/dashboard/profile");
    router.refresh();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-semibold text-slate-800">Edit Profile</h2>
          <p className="text-sm text-slate-500">Update your account information</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
            <input
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 ml-1">Phone Number</label>
            <input
              placeholder="0912345678"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          {/* Location Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 ml-1">Location</label>
            <input
              placeholder="City, Country"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          {/* File Upload (Farmer Only) */}
          {role === "FARMER" && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 ml-1">Verification Document</label>
              <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-4 hover:bg-slate-50 transition-colors group">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <span className="text-sm text-slate-600">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}