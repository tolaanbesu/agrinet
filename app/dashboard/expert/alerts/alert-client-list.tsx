"use client";

import { useState } from "react";
import { Pencil, Trash2, MapPin, PlusCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function AlertClientList({ initialAlerts }: { initialAlerts: any[] }) {
    const [alerts, setAlerts] = useState(initialAlerts);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingAlert, setEditingAlert] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Handle Delete
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this alert?")) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/alerts/delete`, {
                method: "POST",
                body: JSON.stringify({ alertId: id }),
            });
            if (res.ok) setAlerts(alerts.filter(a => a.id !== id));
        } finally {
            setLoading(false);
        }
    };

    // Handle Edit Submit
    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = {
            id: editingAlert.id,
            title: formData.get("title"),
            region: formData.get("region"),
            description: formData.get("description"),
        };

        try {
            const res = await fetch(`/api/alerts/update`, {
                method: "PUT",
                body: JSON.stringify(data),
            });
            if (res.ok) {
                setAlerts(alerts.map(a => a.id === data.id ? { ...a, ...data } : a));
                setIsEditOpen(false);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* CREATE FORM */}
            <div className="lg:col-span-5">
                <Card className="border-t-4 border-t-red-500 shadow-md">
                    <CardHeader><CardTitle className="text-lg flex items-center gap-2"><PlusCircle className="w-5 h-5 text-red-500" /> New Alert</CardTitle></CardHeader>
                    <CardContent>
                        <form action="/api/alerts/create" method="POST" className="space-y-4">
                            <Input name="title" placeholder="Title" required />
                            <Input name="region" placeholder="Region" required />
                            <Textarea name="description" placeholder="Details..." className="h-24" required />
                            <Button type="submit" className="w-full bg-red-600">Post Alert</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* LIST */}
            <div className="lg:col-span-7 space-y-4">
                {alerts.map((alert) => (
                    <Card key={alert.id} className="hover:border-red-200 transition-colors">
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div>
                                <CardTitle className="text-lg font-bold">{alert.title}</CardTitle>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <MapPin className="w-3 h-3" /> {alert.region}
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" onClick={() => { setEditingAlert(alert); setIsEditOpen(true); }}>
                                    <Pencil className="w-4 h-4 text-blue-600" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(alert.id)}>
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent><p className="text-sm text-gray-600 line-clamp-2">{alert.description}</p></CardContent>
                    </Card>
                ))}
            </div>

            {/* EDIT MODAL (POPUP) */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Market Alert</DialogTitle>
                    </DialogHeader>
                    {editingAlert && (
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <Input name="title" defaultValue={editingAlert.title} placeholder="Title" required />
                            <Input name="region" defaultValue={editingAlert.region} placeholder="Region" required />
                            <Textarea name="description" defaultValue={editingAlert.description} className="h-32" required />
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={loading} className="bg-blue-600">
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}