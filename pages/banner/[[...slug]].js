import BannerPageTemplate from "@/components/template/BannerPage";
import BlogPageTemplate from "@/components/template/BlogPage";
import FormBanner from "@/components/template/Form/FormBanner";
import { useRouter } from "next/router";

function BannerPage({ data }) {
  const router = useRouter();
  const { slug } = router.query; // 'slug' will be an array of path segments

  // Check if no additional path segments were provided (i.e., the root /events page)
  if (!slug) {
    return <BannerPageTemplate data={data} />;
  }

  // // Handle the "create" route
  if (slug[0] === "create") {
    return <FormBanner />;
  }

  // // Handle the "detail" route with an ID
  if (slug[0] === "detail" && slug[1]) {
    const eventId = slug[1];
    return <FormBanner eventId={eventId} isEdit />;
  }

  // Fallback or 404 component if the route is not recognized
  return null;
}

export default BannerPage;

export async function getServerSideProps() {
  try {
    const res = await fetch(
      "https://run.mocky.io/v3/8bf94cf2-874c-4b93-aece-9fa26c898c94"
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
