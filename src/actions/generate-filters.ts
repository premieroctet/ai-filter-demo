"use server";

import { COUNTRY_CODES } from "@/utils/utils";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import z from "zod";

const filtersSchema = z.object({
  browser: z
    .string()
    .optional()
    .transform((v) => v?.toLowerCase()),
  country: z.enum(COUNTRY_CODES).optional(),
  os: z
    .string()
    .optional()
    .transform((v) => v?.toLowerCase()),
});

export async function generateFilters(prompt: string) {
  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: filtersSchema,
    prompt,
  });

  return object;
}
