import FormUser from "@/components/template/Form/FormUser";
import UsersPageTemplate from "@/components/template/UsersPage";
import Axios from "@/lib/api";
import { useRouter } from "next/router";

function UserPage({ data, page, perPage }) {
  const router = useRouter();
  const { slug } = router.query; // 'slug' will be an array of path segments

  const handlePageChange = (newPage) => {
    // Redirect to the same path with new page query parameter
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage },
    });
  };

  const handleSearchValue = (searchValue) => {
    // Redirect to the same path with new page query parameter
    router.push({
      pathname: router.pathname,
      query: { ...router.query, search: searchValue },
    });
  };

  // Check if no additional path segments were provided (i.e., the root /events page)
  if (!slug) {
    return (
      <UsersPageTemplate
        data={data}
        handlePageChange={handlePageChange}
        handleSearchValue={handleSearchValue}
        page={page}
      />
    );
  }

  // // Handle the "create" route
  if (slug[0] === "create") {
    return <FormUser />;
  }

  // // Handle the "detail" route with an ID
  if (slug[0] === "detail" && slug[1]) {
    const eventId = slug[1];
    return <FormUser eventId={eventId} isEdit />;
  }

  // Fallback or 404 component if the route is not recognized
  return null;
}

export default UserPage;

export async function getServerSideProps(context) {
  const { query } = context;
  const page = query.page || 1;
  const perPage = query.per_page || 10;
  const search = query.search || "";

  try {
    const res = await Axios.get(
      `/v1/admin/user/list?page=${page}&per_page=${perPage}&search=${search}`
    );

    if (res.status !== 200) {
      throw new Error(`Failed to fetch data with status: ${res.status}`);
    }

    const result = await res.data;
    (
      "🚀 ~ file: [[...slug]].js:49 ~ getServerSideProps ~ result:",
      result
    );

    return {
      props: {
        data: result,
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
      },
    };
  } catch (error) {
    return {
      props: {
        data: null,
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
      },
    };
  }
}
