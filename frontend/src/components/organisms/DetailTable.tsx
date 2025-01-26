import React, { useState, useEffect } from "react";
import "./organismsCSS/DetailTable.css";

interface DetailTableProps {
    DetailTableData: DetailTableDataProps | null;
}

interface DetailTableDataProps {
    elapsedDays: number; // 已过天数
    averageDailyExpense: number; // 日均花销
    totalMonthlyExpense: number; // 月总花销
    predictTotalMonthlyExpense: number; // 预测月总花销
}

export const DetailTable: React.FC<DetailTableProps> = ({
    DetailTableData,
}) => {
    return (
        <table className="detail-table">
            <thead>
                <tr >
                    <th>本月已过天数</th>
                    <th>本月总花销</th>
                    <th>平均每日花销</th>
                    <th>预计本月花销</th>
                </tr>
            </thead>
            <tbody>
                <tr className="table-row">
                    <td>{DetailTableData?.elapsedDays}</td>
                    <td>{DetailTableData?.totalMonthlyExpense}</td>
                    <td>{DetailTableData?.averageDailyExpense}</td>
                    <td>{DetailTableData?.predictTotalMonthlyExpense}</td>
                </tr>
            </tbody>
        </table>
    );
}
