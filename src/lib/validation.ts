import { z } from "zod";
import { serviceNames } from "@/data/services";
import { site } from "@/data/site";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter at least 2 characters.").max(80, "Please keep your name under 80 characters."),
  email: z.string().trim().max(254, "Please use a shorter email address.").email("Please enter a valid email address."),
  company: z.string().trim().max(120, "Please keep this under 120 characters.").optional().default(""),
  service: z.enum(serviceNames, { error: "Please choose a service." }),
  budget: z.string().trim().max(80).refine((value) => !value || site.budgetBands.includes(value), "Please choose one of the budget options.").optional().default(""),
  message: z.string().trim().min(20, "Tell us a little more — at least 20 characters.").max(2000, "Please keep your brief under 2,000 characters."),
  website: z.string().max(200).optional().default(""),
  loadedAt: z.number().finite().positive(),
  turnstileToken: z.string().max(2048).optional().default(""),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;
