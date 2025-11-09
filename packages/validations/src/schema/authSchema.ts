import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  username:z.string().min(8)
});




// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
