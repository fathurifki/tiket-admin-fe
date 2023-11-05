import EventsPageTemplate from "@/components/template/EventPage";
import FormEvents from "@/components/template/Form/FormEvents";
import { useRouter } from "next/router";

function EventsPage({ data }) {
  const router = useRouter();
  const { slug } = router.query; // 'slug' will be an array of path segments

  // Check if no additional path segments were provided (i.e., the root /events page)
  if (!slug) {
    return <EventsPageTemplate data={data} />;
  }

  // Handle the "create" route
  if (slug[0] === "create") {
    return <FormEvents />;
  }

  // // Handle the "detail" route with an ID
  if (slug[0] === "detail" && slug[1]) {
    const eventId = slug[1];
    return <FormEvents eventId={eventId} isEdit />;
  }

  // Fallback or 404 component if the route is not recognized
  return null;
}

export default EventsPage;

export async function getServerSideProps() {
  try {
    const res = await Axios(
      "https://run.mocky.io/v3/3a0bf739-427b-4718-afad-576073540546"
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
