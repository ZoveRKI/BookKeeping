import React, { useState } from "react";
import EditableCell from "./../atoms/EditableCell"; // 引入你提供的组件
import "./organismsCSS/Table.css";

interface TableRow {
    date: number; // 日期 (1-31)
    dailyExpense: string; // 日常花销
    extraExpense: string; // 额外花销
    isEdited: boolean; // 是否已修改
}

const ExpenseTable: React.FC = () => {
    const [rows, setRows] = useState<TableRow[]>([]);

    const addRow = () => {
        const today = new Date().getDate(); // 获取当前日期
        if (rows.some((row) => row.date === today)) {
            alert("已有今天的数据，不能再添加！");
            return;
        }

        const newDate = rows.length + 1;
        setRows(
            (prev) => [
                ...prev,
                { date: newDate, dailyExpense: "", extraExpense: "", isEdited: false },
            ]
        );
    };

    const updateRow = (index: number, key: keyof Omit<TableRow, "date">, value: string) => {
        setRows((prev) =>
            prev.map((row, i) =>
                i === index ? { ...row, [key]: value, isEdited: key !== "isEdited" || true } : row
            )
        );
    };

    const saveRow = (index: number) => {
        const updatedRow = rows[index];
        console.log("Saving row:", updatedRow); // 模拟保存操作

        // 保存成功后重置 isEdited 状态
        setRows((prev) =>
            prev.map((row, i) => (i === index ? { ...row, isEdited: false } : row))
        );
    };

    const deleteRow = (index: number) => {
        setRows((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div>
            <table className="expense-table">
                <thead>
                    <tr>
                        <th>日期</th>
                        <th>日常花销</th>
                        <th>额外花销</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index} className="table-row">
                            <td>{row.date}</td>
                            <td>
                                <EditableCell
                                    initialValue={row.dailyExpense}
                                    onSave={(value) => updateRow(index, "dailyExpense", value)}
                                />
                            </td>
                            <td>
                                <EditableCell
                                    initialValue={row.extraExpense}
                                    onSave={(value) => updateRow(index, "extraExpense", value)}
                                />
                            </td>
                            <td className="row-actions">
                                <button onClick={() => deleteRow(index)}>删除</button>
                                {row.isEdited && (
                                    <button onClick={() => saveRow(index)}>保存</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={addRow} className="add-row-button">
                加号
            </button>
        </div>
    );
};

export default ExpenseTable;
