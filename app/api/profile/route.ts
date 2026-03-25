import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return Response.json(user);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return new Response("Unauthorized", { status: 401 });

  const formData = await req.formData();

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const location = formData.get("location") as string;
  const file = formData.get("document") as File | null;

  let documentUrl: string | undefined;

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const uploadResponse = await cloudinary.uploader.upload(dataUri, {
      folder: "agrinet-documents",
    });

    documentUrl = uploadResponse.secure_url;
  }

  await prisma.user.update({
  where: { id: session.user.id },
  data: {
    ...(name && name.trim() !== "" && { name }),
    ...(phone && phone.trim() !== "" && { phone }),
    ...(location && location.trim() !== "" && { location }),
    ...(documentUrl && { verificationDocument: documentUrl }),
    ...(documentUrl && { verificationStatus: "PENDING" }),
  },
});

  return Response.json({ success: true });
}

