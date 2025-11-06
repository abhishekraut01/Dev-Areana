import { PrismaClient } from "@prisma/client";

const getPrismaSingleton =()=>{
  return new PrismaClient()
}

type getPrismaSingletonType = ReturnType<typeof getPrismaSingleton>

const globelPrimsa = globalThis as unknown as {
  prisma : getPrismaSingletonType | unknown
}

const prisma = globelPrimsa.prisma ?? getPrismaSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globelPrimsa.prisma = prisma;