import { AddOrderRequest } from "@shared-types/order.types";
import { Request, Response } from "express";

export const handleAddOrder = async (
  req: Request<{}, {}, AddOrderRequest>,
  res: Response,
) => {
  console.info("👀 [handleAddOrder] started");

  try {
    const { items, payment, status, totalAmount, userInformation } = req.body;

    console.log(req.body);

    return { status: 200 };
  } catch (error) {
    console.info("❗[handleAddOrder] error:", error);
    return { status: 500 };
  } finally {
    console.info("👉 [handleAddOrder] finally");
  }
};

const ORDEN: AddOrderRequest = {
  items: [
    {
      quantity: 1,
      unitPrice: 12000,
      notes: [],
    },
    {
      quantity: 1,
      unitPrice: 35000,
      notes: [],
    },
  ],
  totalAmount: 47000,
  userInformation: {
    name: "Santiago",
    address: "Barrio Santander",
    phone: "39589328549",
  },
  payment: {
    method: "transferencia",
    status: "pendiente",
  },
  status: "recibida",
};
