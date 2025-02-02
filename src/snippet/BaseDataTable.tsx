import { Dispatch, SetStateAction, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  Cell,
  CoreColumn,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { PaginationType } from '@/types/ResponseType';
import { ITEMS_COUNT_PER_PAGE } from '@/constants/Constants';
import TablePaginator from '@/shared/global/TablePaginator';
import cn from '@/lib/utils';
import { Checkbox } from '@/shared/ui/checkbox';

export type ExtendedCoreColumnDef<TData, TValue> = CoreColumn<TData, TValue> & {
  meta?: {
    className?: string;
  };
};

export type ExtendedColumnDef<TData> = ColumnDef<TData> & {
  meta?: {
    className?: string;
  };
};

export type DataTableProps<TData> = {
  columns: ExtendedColumnDef<TData>[];
  data: TData[];
  addCheckBox?: boolean
  meta?: PaginationType;
  setPage?: Dispatch<SetStateAction<number>>;
};

export default function BaseDataTable<TData>({
  columns,
  data,
  addCheckBox,
  meta,
  setPage,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: meta?.items_on_page || ITEMS_COUNT_PER_PAGE,
      },
    },
    manualPagination: true,
  });

  const [checkedRows, setCheckedRows] = useState<string[]>([]);

  const handleCheckedChange = (rowId: string) => {
    setCheckedRows((prev) => {
      if (prev.includes(rowId)) {
        return prev.filter((val) => val !== rowId);
      }
      return [...prev, rowId];
    });
  };

  if (!table.getRowModel().rows?.length) {
    return null;
  }

  return (
    <div className="hidden md:block rounded-lg overflow-hidden mb-[56px]">
      <div className="border rounded-lg border-solid border-[#D9D9D9] border-r-transparent">
        <Table>
          <TableHeader className="text-[#64748B] bg-[#EAEAEA]">
            {table.getHeaderGroups()
              .map((headerGroup) => (
                <TableRow key={headerGroup.id} className="[&_th:last-child]:rounded-tr-lg">

                  <TableHead className={`truncate text-[#E2E8F0] bg-black ${!addCheckBox && 'border-r-[#E0E0E0] border-r'} max-w-[10vw] rounded-tl-lg`}>{addCheckBox ? '' : 'S/N'}</TableHead>
                  {headerGroup.headers.map((header) => {
                    const customClassName = (
                      header.column.columnDef as ExtendedCoreColumnDef<TData, TData>
                    ).meta?.className;

                    return (
                      <TableHead key={header.id} className={cn(`truncate text-[#E2E8F0] bg-black  border-r border-r-[#E0E0E0] last:border-r-none min-w-[120px] ${!customClassName && 'max-w-[10vw]'}`, customClassName)}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
          </TableHeader>
          <TableBody className="truncate border-r border-r-[#E0E0E0] [&_tr:nth-child(even)]:bg-[#FAFAFA] text-[14px] [&_tr:last-child]:border-none">
            {table.getRowModel().rows?.length ? (
              table.getRowModel()
                .rows
                .map((row, index) => {
                  const sn = meta
                    ? ((meta.current_page - 1) * ITEMS_COUNT_PER_PAGE) + (index + 1)
                    : (index + 1);
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className="even:hover:bg-[#f5f8fc] leading-5 text-[#64748B] h-[52px]"
                    >
                      <TableCell className={`truncate max-w-[10vw] ${!addCheckBox && 'border-r border-r-[#E0E0E0]'}`}>
                        {addCheckBox ? (
                          <Checkbox
                            checked={checkedRows.includes(row.id)}
                            onCheckedChange={() => handleCheckedChange(row.id)}
                            className="rounded-[2px] h-[18px] w-[18px] data-[state=checked]:bg-black data-[state=checked]:border-black"
                          />
                        )
                          : sn}
                      </TableCell>

                      {row.getVisibleCells()
                        .map((cell: Cell<TData, { className: string }>) => {
                          const customClassName = (cell.column.columnDef as ExtendedColumnDef<TData>).meta?.className || '';
                          return (
                            <TableCell
                              key={cell.id}
                              className={cn(`truncate border-r border-r-[#E0E0E0] min-w-[120px] ${!customClassName && 'max-w-[10vw]'}`, customClassName)}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          );
                        })}
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {meta
        ? (
          <TablePaginator
            meta={meta}
            setPage={setPage}
            showPagination={table.getRowModel().rows.length >= 1 && meta.last_page > 1}
          />
        )
        : null}
    </div>
  );
}
