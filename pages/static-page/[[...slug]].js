import FormStaticPage from "@/components/template/Form/FormStaticPage";
import StaticPageTemplate from "@/components/template/StaticPage";
import { useRouter } from "next/router";

function StaticPage({ data }) {
  const router = useRouter();
  const { slug } = router.query; // 'slug' will be an array of path segments

  // Check if no additional path segments were provided (i.e., the root /events page)
  if (!slug) {
    return <StaticPageTemplate data={data} />;
  }

  // // Handle the "create" route
  if (slug[0] === "create") {
    return <FormStaticPage />;
  }

  // // Handle the "detail" route with an ID
  if (slug[0] === "detail" && slug[1]) {
    const eventId = slug[1];
    return <FormStaticPage eventId={eventId} isEdit/>;
  }

  // Fallback or 404 component if the route is not recognized
  return null;
}

export default StaticPage;

export async function getServerSideProps() {
  try {
    const res = await fetch(
      "https://run.mocky.io/v3/f98cabf0-9f5d-485f-bc9c-3ded682b7ddf"
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch data with status: ${res.status}`);
    }

    const result = await res.json();
    (
      "🚀 ~ file: index.jsx:39 ~ getServerSideProps ~ result:",
      result
    );

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
