import BlogPageTemplate from "@/components/template/BlogPage";
import FormBlog from "@/components/template/Form/FormBlog";
import { useRouter } from "next/router";

function BlogPage({ data }) {
  const router = useRouter();
  const { slug } = router.query; // 'slug' will be an array of path segments

  // Check if no additional path segments were provided (i.e., the root /events page)
  if (!slug) {
    return <BlogPageTemplate data={data} />;
  }

  // // Handle the "create" route
  if (slug[0] === "create") {
    return <FormBlog />;
  }

  // // Handle the "detail" route with an ID
  if (slug[0] === "detail" && slug[1]) {
    const eventId = slug[1];
    return <FormBlog eventId={eventId} isEdit />;
  }

  // Fallback or 404 component if the route is not recognized
  return null;
}

export default BlogPage;

export async function getServerSideProps() {
  try {
    const res = await fetch(
      "https://run.mocky.io/v3/b49d988c-b637-427f-aaae-70de9dc40868"
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch data with status: ${res.status}`);
    }

    const result = await res.json();

    return {
      props: {
        data: result,
      },
    };
  } catch (error) {
    return {
      props: {
        data: null,
      },
    };
  }
}
