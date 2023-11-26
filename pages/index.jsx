import RootLayout from "@/app/layout";
import DashboardPage from "./dashboard";
import withAuth from "@/components/atoms/WithAuth";
import { withAuthServerSideProps } from "@/components/atoms/WithAuthSSR";

function Root({ data }) {
  return <DashboardPage />;
}

export default withAuth(Root);

export const getServerSideProps = withAuthServerSideProps(async (context) => {
  const { query } = context;
  const page = query.page || 1;
  const perPage = query.per_page || 10;
  const search = query.search || "";

  try {
    const res = await fetchingData({
      url: `/admin/user/list?page=${page}&per_page=${perPage}&search=${search}`,
      context,
    });

    return {
      props: {
        data: res?.data || {},
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
        res,
      },
    };
  } catch (error) {
    return {
      props: {
        data: null,
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
        error: error.message,
      },
    };
  }
});
