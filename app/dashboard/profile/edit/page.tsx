"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, Upload, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; 

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
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
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load profile data");
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phone", form.phone);
    formData.append("location", form.location);

    if (file) {
      formData.append("document", file);
    }

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      toast.success("Profile updated successfully");
      router.push("/dashboard/profile");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl w-full max-w-md shadow-2xl overflow-hidden border border-border animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b flex justify-between items-center bg-muted/30">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Edit Profile</h2>
            <p className="text-sm text-muted-foreground">Update your personal information</p>
          </div>
          <button 
            onClick={() => router.back()} 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User size={14} className="text-muted-foreground" /> Full Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-11"
                required
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone size={14} className="text-muted-foreground" /> Phone Number
              </Label>
              <Input
                id="phone"
                placeholder="+251..."
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="h-11"
              />
            </div>

            {/* Location Field */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin size={14} className="text-muted-foreground" /> Location
              </Label>
              <Input
                id="location"
                placeholder="City, Country"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="h-11"
              />
            </div>

            {/* File Upload (Farmer Only) */}
            {role === "FARMER" && (
              <div className="space-y-2 pt-2">
                <Label className="flex items-center gap-2 text-primary">
                  <Upload size={14} /> Verification Document
                </Label>
                <div className="relative group">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-muted-foreground/20 rounded-lg cursor-pointer bg-muted/10 hover:bg-muted/30 transition-all hover:border-primary/50">
                    <div className="flex flex-col items-center justify-center py-4">
                      <Upload size={20} className="text-muted-foreground mb-1 group-hover:text-primary transition-colors" />
                      <p className="text-xs text-muted-foreground px-4 text-center">
                        {file ? (
                          <span className="text-primary font-medium">{file.name}</span>
                        ) : (
                          "Upload license or ID for verification"
                        )}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 h-11"
                disabled={submitting}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="flex-1 h-11 font-semibold"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
