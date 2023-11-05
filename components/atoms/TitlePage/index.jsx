import { Button } from "@/components/ui/button";

const TitlePage = ({ title, buttonCreate = false, titleButton, onClickButton }) => {
  return (
    <div className="flex justify-between">
      <span className="font-bold text-2xl">{title}</span>
      {buttonCreate && <Button onClick={onClickButton}>{titleButton}</Button>}
    </div>
  );
};

export default TitlePage;
