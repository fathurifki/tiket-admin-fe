import TitlePage from "@/components/atoms/TitlePage";
import { withAuthServerSideProps } from "@/components/atoms/WithAuthSSR";

function DashboardPage({ data }) {
  return (
    <div className="h-full">
      <TitlePage title="Dashboard" />
    </div>
  );
}

export const getServerSideProps = withAuthServerSideProps(async (context) => {
  const { query } = context;
  const page = query.page || 1;
  const perPage = query.per_page || 10;
  const search = query.search || "";

  try {
    const res = await fetchingData({
      url: `/admin/event/list?page=${page}&per_page=${perPage}`,
      context,
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    });
    return {
      props: {
        data: res.data || null,
        res,
      },
    };
  } catch (error) {
    return {
      props: {
        data: null,
        error,
      },
    };
  }
});

export default DashboardPage;

