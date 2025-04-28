import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { jwtVerify } from "jose";

// Liste des routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = ["/login", "/register", "/api/auth"];

async function verifyApiToken(token: string): Promise<boolean> {
  try {
    if (!token || typeof token !== "string") return false;

    const secret = new TextEncoder().encode(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    );
    const { payload } = await jwtVerify(token, secret);

    // Vérifier la présence des claims nécessaires
    const requiredClaims = ["id", "username", "employeeTypeId"];
    if (!requiredClaims.every((claim) => claim in payload)) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Token verification error:", error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Gestion des routes API mobiles
  if (pathname.startsWith("/api/mobile")) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authorization header missing or invalid" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const isValid = await verifyApiToken(token);
    // console.log(isValid);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si l'utilisateur est connecté et essaie d'accéder à une route publique
  // if (token && isPublicRoute) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // if (isPublicRoute(pathname)) {
  //   return NextResponse.next();
  // }

  return NextResponse.next();
}

// Configuration des routes à protéger
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};

// import { NextResponse, NextRequest } from "next/server";
// import { jwtVerify } from "jose";

// // Routes publiques
// const publicRoutes = [
//   "/login",
//   "/register",
//   "/api/auth",
//   "/auth",
//   "/_next",
//   "/favicon.ico",
//   "/images",
//   "/api/interventions",
// ];

// const isPublicRoute = (pathname: string) => {
//   return publicRoutes.some(
//     (route) => pathname === route || pathname.startsWith(route + "/")
//   );
// };

// async function verifyApiToken(token: string): Promise<boolean> {
//   try {
//     if (!token || typeof token !== "string") return false;

//     const secret = new TextEncoder().encode(
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
//     );
//     const { payload } = await jwtVerify(token, secret);

//     // Vérifier la présence des claims nécessaires
//     const requiredClaims = ["id", "username", "employeeTypeId"];
//     if (!requiredClaims.every((claim) => claim in payload)) {
//       return false;
//     }

//     return true;
//   } catch (error) {
//     console.error("Token verification error:", error);
//     return false;
//   }
// }

// export async function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;

//   // Gestion des routes API mobiles
//   if (pathname.startsWith("/api/mobile")) {
//     const authHeader = request.headers.get("authorization");

//     if (!authHeader?.startsWith("Bearer ")) {
//       return NextResponse.json(
//         { success: false, message: "Authorization header missing or invalid" },
//         { status: 401 }
//       );
//     }

//     const token = authHeader.split(" ")[1];
//     const isValid = await verifyApiToken(token);
//     // console.log(isValid);

//     if (!isValid) {
//       return NextResponse.json(
//         { success: false, message: "Invalid or expired token" },
//         { status: 401 }
//       );
//     }

//     return NextResponse.next();
//   }

//   // Routes publiques
//   if (isPublicRoute(pathname)) {
//     return NextResponse.next();
//   }

//   // Redirection pour les autres routes
//   const loginUrl = new URL("/login", request.url);
//   loginUrl.searchParams.set("callbackUrl", encodeURIComponent(request.url));
//   return NextResponse.redirect(loginUrl);
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico).*)",
//     // "/api/mobile/:path*",
//   ],
// };
