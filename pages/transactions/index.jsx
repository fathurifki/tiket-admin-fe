import withAuth from "@/components/atoms/WithAuth";
import { withAuthServerSideProps } from "@/components/atoms/WithAuthSSR";
import TransactionsPageTemplate from "@/components/template/TransactionPage";
import fetchingData from "@/lib/api";
import { useRouter } from "next/router";

function TransactionsPage({ data }) {
  const router = useRouter();
  const { slug } = router.query;

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

  // 'slug' will be an array of path segments
  // Check if no additional path segments were provided (i.e., the root /transactions page)
  if (!slug) {
    return (
      <TransactionsPageTemplate
        data={data}
        handlePageChange={handlePageChange}
        handleSearchValue={handleSearchValue}
      />
    );
  }

  // // Handle the "create" route
  // if (slug[0] === "create") {
  //   return <FormTransactions />;
  // }

  // todo
  // // Handle the "detail" route with an ID
  // if (slug[0] === "edit" && slug[1]) {
  //   const slugData = slug[1];
  //   const slugId = slug[2];
  //   return <FormTransactions slug={slugData} id={slugId} isEdit />;
  // }

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
      url: `/admin/transaction/list?page=${page}&per_page=${perPage}`,
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

export default withAuth(TransactionsPage);
