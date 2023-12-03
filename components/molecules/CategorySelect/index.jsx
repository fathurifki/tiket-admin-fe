import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import fetchingData from "@/lib/api";
import { useEffect, useState } from "react";

const CategorySelect = ({...props}) => {
  const [state, setState] = useState({
    data: [],
  });

  useEffect(() => {
    fetchingSelect();
  }, []);

  const fetchingSelect = async () => {
    const res = await fetchingData({
      url: "/admin/blog/category/list",
    });
    setState({ ...state, data: res });
  };

  return (
    <Select value={props.value} onValueChange={props.onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {state.data.map((val, i) => (
            <SelectItem key={i} value={val.id}>
              {val.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;
