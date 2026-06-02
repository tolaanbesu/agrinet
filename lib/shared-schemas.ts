import { z } from "zod";

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name cannot exceed 100 characters")
  .refine(
    (val) => /^[a-zA-Z\s]+$/.test(val),
    "Name should not contain special characters and numbers. Only letters and spaces are allowed."
  );

export const quantitySchema = z
  .string()
  .refine((val) => /^[0-9]+$/.test(val), "Quantity must be a whole positive number")
  .refine((val) => Number(val) > 0, "Quantity should not be zero or negative");

export const priceSchema = z
  .string()
  .refine((val) => /^[0-9]+(\.[0-9]{1,2})?$/.test(val), "Price must be a positive number (e.g. 10 or 10.50)")
  .refine((val) => Number(val) > 0, "Price should not be zero or negative");

export const quantityNumberSchema = z
  .number()
  .int("Quantity must be a whole number")
  .positive("Quantity should not be zero or negative");

export const phoneSchema = z
  .string()
  .refine((val) => /^\+?[0-9]{10,15}$/.test(val), "Invalid phone number format (should be 10-15 digits)");

export const locationSchema = z
  .string()
  .min(2, "Location must be at least 2 characters");

export const contentSchema = z
  .string()
  .min(10, "Content must be at least 10 characters");

export const titleSchema = z
  .string()
  .min(5, "Title must be at least 5 characters");
