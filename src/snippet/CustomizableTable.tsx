import { ReactNode } from 'react';
import { DialogClose } from '@radix-ui/react-dialog';

import BaseDataTable, { DataTableProps } from '@/shared/global/BaseDataTable';
import {
  Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription,
} from '@/shared/ui/dialog';
import SvgIcons from '@/icons/SvgIcons';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import useCustomizableContext from '@/hooks/useCustomizableContext';

type CustomizableTableProps<TData> = {
  children: ReactNode
} & DataTableProps<TData>;

export default function CustomizableTable<TData>({
  columns,
  data,
  meta,
  setPage,
  children,
}: CustomizableTableProps<TData>) {
  const { TableToggle } = SvgIcons;

  const { excludedFields, setExcludedFields } = useCustomizableContext();

  const handleFilterChange = (header: string) => {
    setExcludedFields((prev) => {
      if (prev.includes(header)) {
        return prev.filter(((item) => item !== header));
      }
      return [...prev, header];
    });
  };

  const handleSelectAll = () => {
    const AllHeaders = columns.map(((tableColumn) => tableColumn.header as string));
    if (!excludedFields.length) {
      setExcludedFields(AllHeaders);
    } else {
      setExcludedFields([]);
    }
  };

  const filteredColumns = columns.filter((
    (tableColumn) => !excludedFields.includes(tableColumn.header as string)
  ));

  return (
    <div className="max-md:hidden mt-7 max-w-[1212px]">
      <div className="flex-center mb-5 pb-2 lg:max-w-[calc(100vw-290px)] section-scroll overflow-y-hidden justify-between">
        {children}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center rounded-full gap-[9px] h-9 px-4 bg-[#EAEAEA] group hover:bg-[#EAEAEA]">
              <TableToggle />
              <span className="text-[#48464C] text-sm font-medium leading-[20px]">
                Select Columns to Show
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent
            className="w-full max-md:hidden max-w-[472px] overflow-x-hidden max-h-[90vh] rounded-[8px] px-4 py-6"
          >
            <div className="flex-center justify-between mb-4">
              <DialogTitle className="font-medium text-2xl leading-[20px]">Select Columns to Show</DialogTitle>
              <Button onClick={handleSelectAll} className="px-2 h-7" variant="ghost">
                <span className="text-sm font-medium leading-[20px]">
                  {!excludedFields.length ? 'Unselect all' : 'Select all'}
                </span>
              </Button>
              <DialogDescription />
            </div>
            <div className="flex flex-col h-full">
              {
                columns.map((column, index) => {
                  const columnHeader = column.header as string;
                  return (
                    <div key={(index + 1).toString()} className="h-[56px] flex-center gap-3">
                      <Checkbox
                        className="h-[18px] w-[18px]"
                        checked={!excludedFields.includes(columnHeader)}
                        onCheckedChange={() => handleFilterChange(columnHeader)}
                      />
                      <span className="text-[#64748B] text-sm leading-[20px] font-medium">{columnHeader}</span>
                    </div>
                  );
                })
              }
              <DialogClose asChild>
                <Button className="rounded-full flex ml-auto gap-[8px] h-[52px] w-[133px]">
                  <span className="font-medium text-sm leading-[20px]">Done</span>
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <BaseDataTable
          columns={filteredColumns}
          setPage={setPage}
          data={data}
          meta={meta}
        />
      </div>
    </div>
  );
}
