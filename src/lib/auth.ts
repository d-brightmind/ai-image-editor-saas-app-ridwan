import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "~/server/db";
import { Polar } from "@polar-sh/sdk";
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { env } from "~/env";

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
});

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "d918a4e6-a99e-4710-a04e-10b05171884a",
              slug: "Large-Pack",
            },
            {
              productId: "9348718d-f2ca-4463-b08e-3d66b6bd47d3",
              slug: "Medium-Pack",
            },
            {
              productId: "9e93a25b-7c13-4ef5-bf89-dfc9ffc31707",
              slug: "Small-Pack",
            },
          ],
          successUrl: "/dashboard",
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
          onOrderPaid: async (order) => {
            const externalCustomerId = order.data.customer.externalId;

            if (!externalCustomerId) {
              console.error("No external customer ID found.");
              throw new Error("No external customer id found.");
            }

            const productId = order.data.productId;

            let creditsToAdd = 0;

            switch (productId) {
              case "9e93a25b-7c13-4ef5-bf89-dfc9ffc31707":
                creditsToAdd = 50;
                break;
              case "9348718d-f2ca-4463-b08e-3d66b6bd47d3":
                creditsToAdd = 200;
                break;
              case "d918a4e6-a99e-4710-a04e-10b05171884a":
                creditsToAdd = 400;
                break;
            }

            await db.user.update({
              where: { id: externalCustomerId },
              data: {
                credits: {
                  increment: creditsToAdd,
                },
              },
            });
          },
        }),
      ],
    }),
  ],
});