import { redirect } from "next/navigation";

/** Legacy deep links now go to the order where conversations are managed. */
export default function ChatsPage() {
  redirect("/cuenta/reservas");
}
