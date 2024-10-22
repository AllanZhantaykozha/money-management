import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (type: "income" | "expense", content: string, sum: number) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [content, setContent] = React.useState("");
  const [sum, setSum] = React.useState<number>(0);
  const [type, setType] = React.useState<"income" | "expense">("income");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(type, content, sum);
    setContent("");
    setSum(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4">
          Добавить {type === "income" ? "Доход" : "Расход"}
        </h2>
        <form onSubmit={handleSubmit}>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "income" | "expense")}
            className="border border-gray-600 p-2 mb-4 rounded w-full bg-gray-700 text-white"
          >
            <option value="income">Доход</option>
            <option value="expense">Расход</option>
          </select>
          <input
            type="text"
            placeholder="Описание"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border border-gray-600 p-2 mb-4 w-full rounded bg-gray-700 text-white"
            required
          />
          <input
            type="number"
            placeholder="Сумма"
            value={sum}
            onChange={(e) => setSum(Number(e.target.value))}
            className="border border-gray-600 p-2 mb-4 w-full rounded bg-gray-700 text-white"
            required
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 text-gray-400 hover:text-gray-200"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
