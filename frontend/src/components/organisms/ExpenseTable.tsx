import React, { useState, useEffect } from "react";
import EditableCell from "../atoms/EditableCell";
import "./organismsCSS/ExpenseTable.css";
import AddRowButton from "../atoms/AddRowButton";
import DeleteRowButton from "../atoms/DeleteRowButton";
import SaveRowButton from "../atoms/SaveRowButton";
import { useMutation } from '@apollo/client';
import {
    SAVE_ROW_DATA_MUTATION,
    DELETE_ROW_DATA_MUTATION
} from "../../graphql/mutations";

interface ExpenseTableProps {
    yearMonthId: string | null;
    currentYearMonthDays: number;
    expenseTableData: ExpenseTableRowProps[] | null;
    onRefetch: () => void; // 添加 refetch 方法作为 Prop; 考虑使用Zustand状态管理工具来代替这种方法
}

interface ExpenseTableRowProps {
    date: number; // 日期 (1-31)
    dailyExpense: string | number; // 日常花销
    additionalExpense: string | number | []; // 额外花销
    isEdited: boolean; // 是否已修改
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({
    yearMonthId,
    currentYearMonthDays,
    expenseTableData,
    onRefetch: refetch, //ES6 解构赋值语法的重命名形式
}) => {
    const [rows, setRows] = useState<ExpenseTableRowProps[]>([]);

    const addRow = () => {
        const today = new Date().getDate();
        if (rows.some((row) => row.date === today)) {
            alert("已有今天的数据，不能再添加！");
            return;
        }

        const existingDates = rows.map(row => row.date).sort((a, b) => a - b);

        const missingDate = existingDates.length === 0
            ? 1
            : Array.from({ length: existingDates[existingDates.length - 1] }, (_, i) => i + 1)
                .find(date => !existingDates.includes(date)) || (existingDates[existingDates.length - 1] + 1);

        const newRows = [
            ...rows,
            { date: missingDate, dailyExpense: '', additionalExpense: '', isEdited: false },
        ];

        setRows(newRows.sort((a, b) => a.date - b.date));
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
            if (mutationData.saveRowData.isSuccess) {
                setRows((prev) =>
                    prev.map((row) =>
                        row.date === mutationData.saveRowData.date
                            ? { ...row, isEdited: false }
                            : row
                    )
                );
                refetch(); // 重新获取数据
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
        const additionalExpense = Number(updatedRowdata.additionalExpense); // 列表中如果有多个数字，就会是NaN，现在没事，是因为设计的虽然是列表，但是只有一个值

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
                    yearMonthId: yearMonthId,
                    date: updatedRowdata.date,
                    dailyExpense: dailyExpense,
                    additionalExpense: additionalExpense
                }
            },
        });
    };

    const [deleteRowData] = useMutation(DELETE_ROW_DATA_MUTATION, {
        onCompleted: (mutationData) => {
            if (mutationData.deleteRowData.isSuccess) {
                refetch(); // 重新获取数据
            } else {
                console.error("Failed");
            }
        },
        onError: (mutationError) => {
            console.error("Mutation error:", mutationError);
        },
    });

    const deleteRow = (index: number) => {
        const deletedRowData = rows[index];

        deleteRowData({
            variables: {
                input: {
                    yearMonthId: yearMonthId,
                    date: deletedRowData.date
                }
            },
        });

        setRows((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        setRows(expenseTableData || []);
    }, [expenseTableData]);

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
                {rows.length >= currentYearMonthDays
                    ? null
                    : <AddRowButton onClick={addRow} />
                }
            </div>
        </div>
    );
};

export default ExpenseTable;
