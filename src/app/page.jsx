import { redirect } from "next/navigation";

export default function App() {
  redirect("/login");
  return (
    <div>
      <p>Redirect... to login</p>
    </div>
  );
}
