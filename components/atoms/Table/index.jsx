import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function TableSource({ ...props }) {
  return (
    <>
      <Table>
        <TableHeaderWrapper tableConfig={props.tableConfig} />
        <>
          {props?.data?.map((item, i) => (
            <TableBodyWrapper
              item={item}
              tableConfig={props.tableConfig}
              index={i}
              key={i}
            />
          ))}
        </>
      </Table>
    </>
  );
}

function TableHeaderWrapper({ tableConfig }) {
  return (
    <TableHeader>
      <TableRow>
        {tableConfig?.map((config, i) => (
          <TableHead key={i}>{config.headerTitle}</TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

function TableBodyWrapper({ item, tableConfig, index }) {
  return (
    <TableBody>
      <TableRow>
        {tableConfig?.map((config, i) => (
          <TableCellWrapper item={item} config={config} index={index + 1} />
        ))}
      </TableRow>
    </TableBody>
  );
}

function TableCellWrapper({ item, config, index }) {
  return (
    <>
      {config.type === "index-number" && (
        <TableCell className="font-medium">{index}</TableCell>
      )}
      {config.type === "string" && (
        <TableCell className="font-medium">{item[config.key]}</TableCell>
      )}
    </>
  );
}

export default TableSource;
