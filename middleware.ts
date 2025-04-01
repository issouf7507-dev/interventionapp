import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Routes publiques
const publicRoutes = [
  "/login",
  "/register",
  "/api/auth",
  "/auth",
  "/_next",
  "/favicon.ico",
  "/images",
];

const isPublicRoute = (pathname: string) => {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
};

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
  const pathname = request.nextUrl.pathname;

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
    console.log(isValid);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  // Routes publiques
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Redirection pour les autres routes
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", encodeURIComponent(request.url));
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/mobile/:path*",
  ],
};

// native
// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";

// // Routes publiques
// const publicRoutes = [
//   "/login",
//   "/register",
//   "/api/auth",
//   "/auth",
//   "/_next",
//   "/favicon.ico",
//   "/images",
// ];

// const isPublicRoute = (pathname: string) => {
//   return publicRoutes.some(
//     (route) => pathname === route || pathname.startsWith(route + "/")
//   );
// };

// function verifyApiToken(token: string): boolean {
//   try {
//     // Vérifier si le token est une chaîne valide
//     if (!token || typeof token !== "string") return false;

//     // Vérifier le format du token (3 parties séparées par des points)
//     const parts = token.split(".");
//     if (parts.length !== 3) return false;

//     // Décoder le payload (partie du milieu)
//     const payload = JSON.parse(atob(parts[1]));

//     // Vérifier si le token n'est pas expiré
//     if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
//       return false;
//     }

//     // Vérifier si le token contient les informations nécessaires
//     if (!payload.id || !payload.username || !payload.employeeTypeId) {
//       return false;
//     }

//     return true;
//   } catch (error) {
//     console.error("Erreur de vérification:", error);
//     return false;
//   }
// }

// export async function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;
//   console.log("Route demandée:", pathname);

//   // Vérification spécifique pour /api/mobile
//   if (pathname.startsWith("/api/mobile")) {
//     const authHeader = request.headers.get("Authorization");
//     console.log("Header Authorization:", authHeader);

//     if (authHeader?.startsWith("Bearer ")) {
//       const token = authHeader.split(" ")[1];
//       const isValid = verifyApiToken(token);
//       console.log(isValid);

//       // if (isValid) {
//       //   return NextResponse.next();
//       // }

//       return NextResponse.json(
//         { success: false, message: "Token invalide ou manquant" },
//         { status: 401 }
//       );
//     }

//     return NextResponse.json(
//       { success: false, message: "Header Authorization manquant" },
//       { status: 401 }
//     );
//   }

//   // Routes publiques
//   if (isPublicRoute(pathname)) {
//     return NextResponse.next();
//   }

//   // Pour les autres routes, rediriger vers la page de connexion
//   const loginUrl = new URL("/login", request.url);
//   loginUrl.searchParams.set("callbackUrl", encodeURIComponent(request.url));
//   return NextResponse.redirect(loginUrl);
// }

// // Routes où le middleware s'applique
// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico).*)",
//     "/api/mobile/:path*",
//   ],
// };

// jose

// import { NextResponse, NextRequest } from "next/server";
// import { base64url } from "jose"; // Lightweight alternative for Edge

// // Routes publiques
// const publicRoutes = [
//   "/login",
//   "/register",
//   "/api/auth",
//   "/auth",
//   "/_next",
//   "/favicon.ico",
//   "/images",
// ];

// const isPublicRoute = (pathname: string) => {
//   return publicRoutes.some(
//     (route) => pathname === route || pathname.startsWith(route + "/")
//   );
// };

// async function verifyApiToken(token: string): Promise<boolean> {
//   try {
//     if (!token || typeof token !== "string") return false;

//     // Vérification simplifiée mais plus sécurisée
//     const [header, payload, signature] = token.split(".");
//     if (!header || !payload || !signature) return false;

//     // Décodage sécurisé avec jose (compatible Edge)
//     const decodedPayload = JSON.parse(
//       new TextDecoder().decode(base64url.decode(payload))
//     );

//     // Vérifications minimales
//     if (
//       !decodedPayload.exp ||
//       decodedPayload.exp < Math.floor(Date.now() / 1000)
//     ) {
//       return false;
//     }

//     // Vérifier la présence des claims nécessaires
//     const requiredClaims = ["id", "username", "employeeTypeId"];
//     if (!requiredClaims.every((claim) => claim in decodedPayload)) {
//       return false;
//     }

//     // Optionnel: Vérifier le format de la signature (sans la valider cryptographiquement)
//     if (!/^[a-zA-Z0-9_-]+$/.test(signature)) {
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
//     console.log(isValid);

//     if (!isValid) {
//       return NextResponse.json(
//         { success: false, message: "Invalid or expired token" },
//         { status: 401 }
//       );
//     }

//     // Décoder le token pour extraire les infos utilisateur
//     const payload = JSON.parse(
//       new TextDecoder().decode(base64url.decode(token.split(".")[1]))
//     );

//     // Ajouter les infos utilisateur aux headers
//     const headers = new Headers(request.headers);
//     headers.set("x-user-id", payload.id);
//     headers.set("x-user-role", payload.employeeTypeId);

//     return NextResponse.next({ request: { headers } });
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
//     "/api/mobile/:path*",
//   ],
// };
