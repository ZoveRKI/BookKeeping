import React, { useState } from "react";
import EditableCell from "../atoms/EditableCell"; // 引入你提供的组件
import "./organismsCSS/ExpenseTable.css";
import AddRowButton from "../atoms/AddRowButton";
import DeleteRowButton from "../atoms/DeleteRowButton";
import SaveRowButton from "../atoms/SaveRowButton";

interface ExpenseTableRowProps {
    date: number; // 日期 (1-31)
    dailyExpense: string | number; // 日常花销
    additionalExpense: string | number; // 额外花销
    isEdited: boolean; // 是否已修改
}

const ExpenseTable: React.FC = () => {
    const [rows, setRows] = useState<ExpenseTableRowProps[]>([]);

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
                { date: newDate, dailyExpense: '', additionalExpense: '', isEdited: false },
            ]
        );
    };

    const updateRow = (index: number, key: keyof Omit<ExpenseTableRowProps, "date">, value: string) => {
        setRows((prev) =>
            prev.map((row, i) => {
                if (i === index) {
                    const updatedRow = { ...row, [key]: value };

                    // 检查值是否有变化，如果变化则标记为 isEdited
                    if (String(row[key]) !== value) {
                        updatedRow.isEdited = true;
                    }
                    return updatedRow;
                }
                return row;
            })
        );
    };

    // TODO: Mutation
    const saveRow = (index: number) => {
        const updatedRowdata = rows[index];
        updatedRowdata.dailyExpense = Number(updatedRowdata.dailyExpense);
        updatedRowdata.additionalExpense = Number(updatedRowdata.additionalExpense);
        console.log("Saving row:", updatedRowdata); // 模拟保存操作

        // 保存成功后重置 isEdited 状态
        setRows((prev) =>
            prev.map((row, i) => (i === index ? { ...row, isEdited: false } : row))
        );
    };

    // TODO: Mutation
    const deleteRow = (index: number) => {
        setRows((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="table-container">
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
                                <div className="table-editable-cell">
                                    <EditableCell
                                        onSave={(value) => updateRow(index, "dailyExpense", value)}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="table-editable-cell">
                                    <EditableCell
                                        onSave={(value) => updateRow(index, "additionalExpense", value)}
                                    />
                                </div>
                            </td>
                            <div className="row-actions">
                                {row.isEdited && (
                                    <div className="action-button">
                                        <SaveRowButton onClick={() => saveRow(index)} />
                                    </div>
                                )}
                                <div className="action-button">
                                    <DeleteRowButton onClick={() => deleteRow(index)} />
                                </div>
                            </div>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="add-row-button">
                <AddRowButton onClick={addRow} />
            </div>
        </div>
    );
};

export default ExpenseTable;
