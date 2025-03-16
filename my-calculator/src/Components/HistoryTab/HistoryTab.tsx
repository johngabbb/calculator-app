import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

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
    <div className="p-5 flex flex-col h-full">
      <div className="text-emerald-600 font-bold p-5">History</div>

      <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
        <div className="pr-4">
          {historyArray.map((entry, index) => {
            // Split the entry by the equals sign
            const parts = entry.split("=");

            if (parts.length >= 2) {
              const operation = parts[0].trim();
              const result = parts[1].trim();

              return (
                <div key={index} className="text-white p-3 m-3 bg-neutral-900 rounded-md">
                  <div className="text-neutral-400 mb-1">{operation}</div>
                  <div className="text-lg font-bold">{result}</div>
                </div>
              );
            }

            // Fallback
            return (
              <div key={index} className="text-white p-3 m-3 bg-neutral-900 rounded-md">
                {entry}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="mt-4">
        {historyArray.length === 0 ? (
          <p className="text-neutral-500 font-bold">No history yet</p>
        ) : (
          <Button
            className="bg-emerald-800 hover:bg-emerald-950 transition-colors font-bold"
            onClick={handleClearHistory}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default HistoryTab;
