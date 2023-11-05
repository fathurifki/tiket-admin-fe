import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TitlePage from "@/components/atoms/TitlePage";
import TableSource from "@/components/atoms/Table";

function DashboardPage({ data }) {
  ("🚀 ~ file: index.jsx:13 ~ DashboardPage ~ data:", data);

  return (
    <div className="h-full">
      <TitlePage title="Dashboard" />
    </div>
  );
}

export default DashboardPage;
