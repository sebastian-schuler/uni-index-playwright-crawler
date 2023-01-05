import { PrismaClient } from "@prisma/client";

// Docs about instantiating `PrismaClient` with Next.js:
// https://pris.ly/d/help/next-js-best-practices

declare global {
    var prisma: PrismaClient | undefined
}

const prisma =
    global.prisma ||
    new PrismaClient({
        //  log: ['query'],
    });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma;