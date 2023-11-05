import TableSource from "@/components/atoms/Table";
import TitlePage from "@/components/atoms/TitlePage";
import { useRouter } from "next/router";

const BlogPageTemplate = ({ data }) => {
  const router = useRouter();

  const tableConfig = [
    {
      headerTitle: "#",
      type: "index-number",
    },
    {
      headerTitle: "Title",
      key: "title",
      type: "string",
    },
    {
      headerTitle: "Slug",
      key: "slug",
      type: "string",
    },
    {
      headerTitle: "Content",
      key: "content",
      type: "string",
    },
    {
      headerTitle: "Author",
      // key: "content",
      type: "string",
    },
    {
      headerTitle: "Categories",
      // key: "content",
      type: "string",
    },
    {
      headerTitle: "Tags",
      // key: "content",
      type: "string",
    },
    {
      headerTitle: "Published at",
      key: "published_at",
      type: "string",
    },
    {
      headerTitle: "Updated at",
      key: "updated_at",
      type: "string",
    },
  ];

  const handleRedirect = () => {
    router.push("/blog/create");
  };

  return (
    <div className="h-full">
      <TitlePage
        title="Blog"
        buttonCreate
        titleButton="Create Blog"
        onClickButton={handleRedirect}
      />
      <div className="mt-6">
        <TableSource data={data.data} tableConfig={tableConfig} />
      </div>
    </div>
  );
};

export default BlogPageTemplate;
