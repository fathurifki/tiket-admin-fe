import TableSource from "@/components/atoms/Table";
import TitlePage from "@/components/atoms/TitlePage";
import { useRouter } from "next/router";

const BannerPageTemplate = ({ data }) => {
  const router = useRouter();

  const tableConfig = [
    {
      headerTitle: "#",
      type: "index-number",
    },
    {
      headerTitle: "Slug",
      key: "slug_name",
      type: "string",
    },
    {
      headerTitle: "Image",
      key: "source_image",
      type: "string",
    },
    {
      headerTitle: "Type",
      key: "type",
      type: "string",
    },
    {
      headerTitle: "Created At",
      key: "created_at",
      type: "string",
    },
  ];

  const handleRedirect = () => {
    router.push("/banner/create");
  };

  return (
    <div className="h-full">
      <TitlePage
        title="Banner"
        buttonCreate
        titleButton="Create Banner"
        onClickButton={handleRedirect}
      />
      <div className="mt-6">
        <TableSource data={data} tableConfig={tableConfig} />
      </div>
    </div>
  );
};

export default BannerPageTemplate;
