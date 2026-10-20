import AccountAuthPage from "@/components/AccountAuthPage";

// Alias de conveniencia: /cuenta ya actuaba como inicio de sesión
// (initialAuthMode="login"), pero no existía una URL propia /login.
// Se agregó para que el equipo pueda compartir un enlace directo de
// inicio de sesión en la feria sin tener que explicar que "cuenta" es
// la pantalla de login.
export default function LoginPage() {
  return <AccountAuthPage initialAuthMode="login" />;
}
