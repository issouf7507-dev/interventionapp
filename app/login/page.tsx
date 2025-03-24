import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className=" grid grid-cols-2 items-center justify-center h-screen">
      <div className="px-36">
        <div className="mb-3">
          <h1 className="text-2xl text-center mb-2 font-bold">Connexion</h1>
          <p className="">
            Entrez vos identifiants pour accéder à votre compte
          </p>
        </div>
        <LoginForm />
        <p className="mt-3 text-center">
          <Link
            href="/register"
            className="hover:text-brand hover:underline underline-offset-4"
          >
            {"Vous n'avez pas de compte? S'inscrire"}
          </Link>
        </p>
      </div>
      <div className="bg-neutral-800 h-screen"></div>
    </div>
  );
}
