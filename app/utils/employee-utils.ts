import { hash } from "bcryptjs";

export function generateEmployeeCredentials(
  firstName: string,
  lastName: string
) {
  // Générer un identifiant unique basé sur le nom et prénom
  const baseUsername = `${firstName
    .toLowerCase()
    .charAt(0)}${lastName.toLowerCase()}`;
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  const username = `${baseUsername}${randomNum}`;

  // Générer un mot de passe aléatoire
  const password = Math.random().toString(36).slice(-8);

  return {
    username,
    password,
  };
}

export async function hashPassword(password: string) {
  return hash(password, 10);
}
