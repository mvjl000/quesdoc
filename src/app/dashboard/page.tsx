import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Dashboard = () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user.id) redirect("/auth-callback?origin=dashboard");

  return (
    <div>
      <p>Hello, {user.given_name}</p>
    </div>
  );
};

export default Dashboard;
