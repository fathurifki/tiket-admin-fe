import withAuth from "@/components/atoms/WithAuth";
import { withAuthServerSideProps } from "@/components/atoms/WithAuthSSR";
import BannerPageTemplate from "@/components/template/BannerPage";
import FormBanner from "@/components/template/Form/FormBanner";
import fetchingData from "@/lib/api";
import { useRouter } from "next/router";

function BannerPage({ data }) {
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
      <BannerPageTemplate
        data={data}
        handlePageChange={handlePageChange}
        handleSearchValue={handleSearchValue}
      />
    );
  }

  // // Handle the "create" route
  if (slug[0] === "create") {
    return <FormBanner />;
  }

  // // Handle the "detail" route with an ID
  if (slug[0] === "edit" && slug[1]) {
    const eventId = slug[1];
    return <FormBanner eventId={eventId} isEdit />;
  }

  // Fallback or 404 component if the route is not recognized
  return null;
}


export const getServerSideProps = withAuthServerSideProps(async (context) => {
  const { query } = context;
  const page = query.page || 1;
  const perPage = query.per_page || 10;
  const search = query.search || "";
  try {
    const res = await fetchingData({
      url: `/admin/banner/list?page=${page}&per_page=${perPage}`,
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
      },
    };
  }
});

export default withAuth(BannerPage);
