import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tx_ref, status } = body;

    if (status === "success" && tx_ref) {
      await prisma.order.updateMany({
        where: { tx_ref },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED",
        },
      });

      return NextResponse.json(
        { message: "Webhook received and processed" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Webhook received but payment not successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tx_ref = searchParams.get("tx_ref");

  if (tx_ref) {
    try {
      const response = await axios.get(
        `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          },
        }
      );

      const status = response.data?.data?.status;

      if (status === "success") {
        await prisma.order.updateMany({
          where: { tx_ref, paymentStatus: "PENDING" },
          data: { paymentStatus: "PAID", status: "CONFIRMED" },
        });
      }
    } catch (error) {
      console.error("GET Verification failed:", error);

    }
  }

  return NextResponse.redirect(
    new URL("/dashboard/buyer/orders", req.url)
  );
}
