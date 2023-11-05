import TableSource from "@/components/atoms/Table";
import TitlePage from "@/components/atoms/TitlePage";
import { useRouter } from "next/router";

const StaticPageTemplate = ({ data }) => {
  const router = useRouter();
  
  const tableConfig = [
    {
      headerTitle: "#",
      type: "index-number",
    },
    {
      headerTitle: "Slug",
      key: "slug",
      type: "string",
    },
    {
      headerTitle: "Created at",
      key: "created_at",
      type: "string",
    },
  ];

  const handleRedirect = () => {
    router.push("/static-page/create");
  };

  return (
    <div className="h-full">
      <TitlePage
        title="Static Page"
        buttonCreate
        titleButton="Create Page"
        onClickButton={handleRedirect}
      />
      <div className="mt-6">
        <TableSource data={data?.data} tableConfig={tableConfig} />
      </div>
    </div>
  );
};

export default StaticPageTemplate;
