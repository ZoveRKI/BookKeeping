import React, { useState, useEffect } from "react";
import EditableCell from "../atoms/EditableCell"; // 引入你提供的组件
import "./organismsCSS/ExpenseTable.css";
import AddRowButton from "../atoms/AddRowButton";
import DeleteRowButton from "../atoms/DeleteRowButton";
import SaveRowButton from "../atoms/SaveRowButton";
import { useMutation } from '@apollo/client';
import { SAVE_ROW_DATA_MUTATION } from "../../graphql/mutations";

interface ExpenseTableProps {
    yearMonthId: number;
    expenseTableData: ExpenseTableRowProps[];
}

interface ExpenseTableRowProps {
    date: number; // 日期 (1-31)
    dailyExpense: string | number; // 日常花销
    additionalExpense: string | number | []; // 额外花销
    isEdited: boolean; // 是否已修改
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({
    yearMonthId,
    expenseTableData,
}) => {
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

    const updateRow = (index: number, key: keyof Omit<ExpenseTableRowProps, "date">, value: string | string[]) => {
        setRows((prev) =>
            prev.map((row, i) => {
                if (i === index) {
                    let updatedRow = { ...row };
                    if (key === "additionalExpense") {
                        updatedRow[key] = value as [];
                    } else if (key === "dailyExpense") {
                        updatedRow[key] = value as string;
                    }

                    // 检查值是否有变化，如果变化则标记为 isEdited
                    // 不管类型是什么，同样都变换为字符串进行比较，省来回变检查起来麻烦
                    if (String(row[key]) !== String(value)) {
                        updatedRow.isEdited = true;
                    }
                    return updatedRow;
                }
                return row;
            })
        );
    };

    const [saveRowData] = useMutation(SAVE_ROW_DATA_MUTATION, {
        onCompleted: (mutationData) => {
            console.log("Mutation result:", mutationData);
            if (mutationData.saveRowData.isSuccess) {
                setRows((prev) =>
                    prev.map((row) =>
                        row.date === mutationData.saveRowData.date
                            ? { ...row, isEdited: false }
                            : row
                    )
                );
                console.log("Success");
            } else {
                console.error("Failed");
            }
        },
        onError: (mutationError) => {
            console.error("Mutation error:", mutationError);
        },
    });

    const saveRow = (index: number) => {
        const updatedRowdata = rows[index];
        const dailyExpense = Number(updatedRowdata.dailyExpense);
        const additionalExpense = Number(updatedRowdata.additionalExpense);

        if (isNaN(dailyExpense) || isNaN(additionalExpense)) {
            alert("花销数据必须是有效数字！");
            return;
        }

        if (updatedRowdata.dailyExpense === '') {
            alert("花销数据不能为空！");
            return;
        }

        saveRowData({
            variables: {
                input: {
                    userId: localStorage.getItem("userId"),
                    yearMonthId: yearMonthId,
                    date: updatedRowdata.date,
                    dailyExpense: dailyExpense,
                    additionalExpense: additionalExpense
                }
            },
        });
    };

    // console.log("After saving row:", rows);

    // TODO: Mutation
    const deleteRow = (index: number) => {
        setRows((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        setRows(expenseTableData || []);
    }, [expenseTableData]);

    // console.log('Row', rows)

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
                                        initialValue={row.dailyExpense.toString()}
                                        onSave={(value) => updateRow(index, "dailyExpense", value)}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="table-editable-cell">
                                    {/* 目前额外花销是列表但是只有一个值，所以直接转换为字符串;虽然考虑未来有可能变为多个，但目前来看，变多个不好，但也懒得去改数据库（一对多变为一对一）;如需要明确额外花销都是什么，就去用注释功能详细注明才对 */}
                                    {/* row.additionalExpense as Array<number | string> 直接断言为列表 */}
                                    {/* 不等于0会导致map报错，因为ts无法明确判断row.additionalExpense的类型，因为length可能未定义 */}
                                    {Array.isArray(row.additionalExpense) && (row.additionalExpense).length > 0 ? (
                                        row.additionalExpense.map(
                                            (additionalExpenseValue: number | string, expenseIndex: number) => (
                                                <EditableCell
                                                    key={expenseIndex}
                                                    initialValue={
                                                        additionalExpenseValue ? additionalExpenseValue.toString() : ''
                                                    }
                                                    onSave={(value) => {
                                                        const tempList = [value]
                                                        updateRow(index, "additionalExpense", tempList)
                                                    }}
                                                />
                                            )
                                        )
                                    ) : (
                                        <EditableCell
                                            onSave={(value) => updateRow(index, "additionalExpense", value)}
                                        />
                                    )}
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
