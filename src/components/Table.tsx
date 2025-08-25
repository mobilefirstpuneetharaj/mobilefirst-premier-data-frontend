// Table.tsx - Updated with Tailwind CSS row styling
import React from "react";

interface Column {
  key: string;
  label: string;
  className?: string;
  width?: string;
}

interface TableProps {
  columns: Column[];
  data: Record<string, any>[];
  onRowClick?: (row: any) => void;
  rowClassName?: string;
}

const Table: React.FC<TableProps> = ({ columns, data, onRowClick, rowClassName }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-2 text-left text-sm font-semibold text-gray-700 ${col.width || ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${rowClassName || ''} ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-2 text-sm text-gray-600 ${col.className || ''}`}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;