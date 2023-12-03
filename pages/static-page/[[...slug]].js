import { withAuthServerSideProps } from "@/components/atoms/WithAuthSSR";
import FormStaticPage from "@/components/template/Form/FormStaticPage";
import StaticPageTemplate from "@/components/template/StaticPage";
import fetchingData from "@/lib/api";
import { useRouter } from "next/router";

function StaticPage({ data }) {
  const router = useRouter();
  const { slug } = router.query; // 'slug' will be an array of path segments

  const handlePageChange = (newPage) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage },
    });
  };

  const handleSearchValue = (searchValue) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, search: searchValue },
    });
  };

  // Check if no additional path segments were provided (i.e., the root /events page)
  if (!slug) {
    return (
      <StaticPageTemplate
        data={data}
        handlePageChange={handlePageChange}
        handleSearchValue={handleSearchValue}
      />
    );
  }

  // // Handle the "create" route
  if (slug[0] === "create") {
    return <FormStaticPage />;
  }

  // // Handle the "detail" route with an ID
  if (slug[0] === "edit" && slug[1]) {
    const slugData = slug[1];
    const slugId = slug[2];
    return <FormStaticPage slug={slugData} id={slugId} isEdit />;
  }

  // Fallback or 404 component if the route is not recognized
  return null;
}

export default StaticPage;

export const getServerSideProps = withAuthServerSideProps(async (context) => {
  const { query } = context;
  const page = query.page || 1;
  const perPage = query.per_page || 10;
  const search = query.search || "";

  try {
    const res = await fetchingData({
      url: `/admin/page/list?page=${page}&per_page=${perPage}`,
      context,
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    });
    return {
      props: {
        data: res || null,
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
