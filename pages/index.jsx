import RootLayout from "@/app/layout";
import DashboardPage from "./dashboard";
import withAuth from "@/components/atoms/WithAuth";

function Root({ data }) {
  return <DashboardPage data={data} />;
}

export default withAuth(Root)