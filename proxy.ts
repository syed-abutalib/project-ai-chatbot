import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  
  matcher: [
    // Exclude webhook route 👇
    "/((?!_next|api/webhooks/clerk|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Apply to API except webhook
    "/(api|trpc)(.*)",
  ],
};
