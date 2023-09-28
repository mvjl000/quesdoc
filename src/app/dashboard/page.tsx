import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const Dashboard = () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  return (
    <div>
      <p>Hello, {user.given_name}</p>
    </div>
  );
};

export default Dashboard;
