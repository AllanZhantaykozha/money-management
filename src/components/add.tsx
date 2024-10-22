import { useState, useEffect } from "react";
import Modal from "./modal"; // Подкорректируйте путь импорта в зависимости от вашей структуры
import Cookies from "js-cookie";

interface IList {
  amount: number;
  income: IIncome[];
  expenses: IExpenses[];
}

interface IExpenses {
  content: string;
  sum: number;
}

interface IIncome {
  content: string;
  sum: number;
}

export default function Add() {
  const [list, setList] = useState<IList[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Загрузка данных из cookies при инициализации
  useEffect(() => {
    const savedList = Cookies.get("financialData");
    if (savedList) {
      setList(JSON.parse(savedList));
    }
  }, []);

  // Сохранение данных в cookies
  const saveToCookies = (data: IList[]) => {
    Cookies.set("financialData", JSON.stringify(data), { expires: 7 });
  };

  const addToList = (
    type: "income" | "expense",
    content: string,
    sum: number
  ) => {
    const newEntry = { content, sum };
    if (type === "income") {
      const newList = [
        ...list,
        { amount: sum, income: [newEntry], expenses: [] },
      ];
      setList(newList);
      saveToCookies(newList);
    } else {
      const lastItem = list[list.length - 1] || {
        amount: 0,
        income: [],
        expenses: [],
      };
      const newList = [
        ...list.slice(0, -1),
        {
          ...lastItem,
          expenses: [...lastItem.expenses, newEntry],
          amount: lastItem.amount - sum,
        },
      ];
      setList(newList);
      saveToCookies(newList);
    }
  };

  const totalIncome = list.reduce(
    (acc, item) =>
      acc + item.income.reduce((sum, income) => sum + income.sum, 0),
    0
  );
  const totalExpenses = list.reduce(
    (acc, item) =>
      acc + item.expenses.reduce((sum, expense) => sum + expense.sum, 0),
    0
  );
  const totalAmount = totalIncome + totalExpenses;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white">
      <div className="max-w-2xl w-full p-6 bg-gray-900 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Трекер доходов и расходов
        </h2>

        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold">
            Общая сумма: {totalAmount} ₸
          </h3>
        </div>

        <div className="flex justify-between mb-6 border-b-2 border-gray-600 pb-4">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-green-400">
              Всего доходов
            </h3>
            <p className="text-3xl font-bold">{totalIncome} ₸</p>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-red-400">
              Всего расходов
            </h3>
            <p className="text-3xl font-bold">{totalExpenses} ₸</p>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            Добавить доход/расход
          </button>
        </div>

        <h3 className="text-xl font-bold mb-4 text-center">Список</h3>
        <table className="min-w-full border-collapse border border-gray-600">
          <thead>
            <tr>
              <th className="border border-gray-600 p-2 text-left">Расходы</th>
              <th className="border border-gray-600 p-2 text-left">Доходы</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-600 p-2">
                  <ul>
                    {item.expenses.map((expense, i) => (
                      <li key={i}>
                        {expense.content}: {expense.sum}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border border-gray-600 p-2">
                  <ul>
                    {item.income.map((income, i) => (
                      <li key={i}>
                        {income.content}: {income.sum}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={addToList}
        />
      </div>
    </div>
  );
}
