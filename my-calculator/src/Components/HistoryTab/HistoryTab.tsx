import { Button } from "../ui/button";

interface Props {
  historyClick: boolean;
  historyArray: string[];
  setHistoryArray: (history: string[]) => void;
}

const HistoryTab = ({ historyClick, historyArray, setHistoryArray }: Props) => {
  const handleClearHistory = () => {
    setHistoryArray([]);
  };

  return (
    <>
      <div className="mx-2 flex  justify-center">
        <div className="h-full w-px bg-white"></div>
      </div>
      <div>
        {historyArray.map((entry) => (
          <div className="text-white">{entry}</div>
        ))}
      </div>
      <Button className="bg-amber-600" onClick={handleClearHistory}>
        DELETE HISTORY
      </Button>
    </>
  );
};

export default HistoryTab;
