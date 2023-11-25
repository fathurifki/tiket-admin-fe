import RootLayout from "@/app/layout";
import DashboardPage from "./dashboard";

export default function Root({ data }) {
  return <DashboardPage data={data} />;
}

export async function getServerSideProps() {
  try {
    const res = await fetch(
      "https://6530f00d6c756603295f5c52.mockapi.io/api/v1/management/list"
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch data with status: ${res.status}`);
    }

    const result = await res.json();
    "🚀 ~ file: index.jsx:18 ~ getServerSideProps ~ result:", result;

    return {
      props: {
        data: result,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        data: null,
      },
    };
  }
}
