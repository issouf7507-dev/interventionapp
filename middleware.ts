import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Configuration des routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = [
  "/login",
  "/register",
  "/api/auth",
  "/auth",
  "/_next",
  "/favicon.ico",
  "/images",
];

// Vérifier si la route actuelle est une route publique
const isPublicRoute = (pathname: string) => {
  return publicRoutes.some((route) => pathname.startsWith(route));
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Si c'est une route publique, on laisse passer
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Vérifier si l'utilisateur est connecté
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    // Ajouter la redirection après connexion
    loginUrl.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(loginUrl);
  }

  // Si l'utilisateur est connecté, on laisse passer
  return NextResponse.next();
}

// Configurer les routes sur lesquelles le middleware s'applique
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. API routes (/api/*)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
