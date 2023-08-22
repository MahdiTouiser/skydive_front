/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table } from "flowbite-react";
import {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  ForwardedRef,
  useImperativeHandle,
} from "react";
import {
  ColDef,
  ColHeader,
  ColSortChangeEvent,
  GridGetData,
  GridParams,
  GridRef,
  GridRowModel,
  GridRowActions,
  GridSortItem,
  SortStateType,
} from "./grid.types";
import ReactPaginate from "react-paginate";
import { SelectPageEvent } from "../../../models/shared.models";
import SDSpinner from "../Spinner";
import GridHeaderComponent from "./GridHeaderComponent";
import GridRow from "./GridRow";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface GridProps<T = any> {
  data?: T[];
  getData?: GridGetData<T>;
  colDefs: ColDef<T>[];
  // fetchData?: () => void;
  onDoubleClick?: (data: T) => void;
  rowActions?: GridRowActions<T> | null;
  onEditRow?: (item: T) => void;
  onRemoveRow?: (item: T) => void;
  pageSize?: number | null;
  onPagination?: (gridParams: GridParams) => void;
  multiSortable?: boolean;
}

function MainGrid<T = any>(
  {
    data,
    colDefs,
    // fetchData,
    onDoubleClick,
    onEditRow,
    onRemoveRow,
    getData,
    rowActions = {
      edit: true,
      remove: true,
      otherActions: [],
      moreActions: [],
    },
    pageSize: defaultPageSize = 10,
    onPagination,
    multiSortable = false,
  }: GridProps<T>,
  ref: ForwardedRef<GridRef>
) {
  const [gridRows, setGridRows] = useState<GridRowModel<T>[]>([]);
  const [colHeaders, setColHeaders] = useState<ColHeader[]>([]);
  const [pageCount, setPageCount] = useState<number>();
  const [selectedPage, setSelectedPage] = useState(0);
  const [pageSize, setPageSize] = useState<number | null>(defaultPageSize);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [gridSorts, setGridSorts] = useState<GridSortItem[]>([]);
  const makeGridRows = useCallback((items: T[], colDefs: ColDef<T>[]) => {
    const rows: GridRowModel[] = items.map((item) => {
      return new GridRowModel<T>(item, colDefs);
    });

    setGridRows(rows);
  }, []);

  const loadGrid = useCallback(
    (gridParams?: GridParams) => {
      if (data) {
        makeGridRows(data, colDefs);
      } else if (getData) {
        setIsPending(true);
        const isRefreshing = gridParams === undefined;
        const params: GridParams = isRefreshing
          ? {
              pageIndex: 1,
              pageSize: pageSize === null ? 100000 : pageSize,
              sorts: [],
            }
          : gridParams;
        getData(
          params,
          (items: T[], total?: number) => {
            makeGridRows(items, colDefs);
            if (pageSize && total) {
              setPageCount(Math.ceil(total / pageSize));
            }
            if (isRefreshing) {
              setSelectedPage(0);
            }
            setIsPending(false);
          },
          (error) => {
            console.log(error);
            setIsPending(false);
          }
        );
      }
    },
    [data, colDefs, makeGridRows, getData, pageSize]
  );

  const onRowDobuleClisk = (item: T) => {
    console.log(item);
    if (onDoubleClick) {
      onDoubleClick(item);
    }
  };

  const handlePageClick = (event: SelectPageEvent) => {
    if (pageSize !== null) {
      setSelectedPage(event.selected);
      if (onPagination) {
        onPagination({
          pageIndex: event.selected,
          pageSize: pageSize,
          sorts: gridSorts,
        });
        return;
      }
      if (getData) {
        setIsPending(true);
        loadGrid({
          pageIndex: event.selected + 1,
          pageSize: pageSize,
          sorts: gridSorts,
        });
        // getData(
        //   { pageIndex: event.selected + 1, pageSize: pageSize },
        //   (items: T[], total: number) => {
        //     makeGridRows(items, colDefs);
        //     if (pageSize) {
        //       setPageCount(Math.ceil(total / pageSize));
        //     }
        //     setIsPending(false);
        //   }
        // );
      }
    }
  };

  const onSortChange = ({ field, sort }: ColSortChangeEvent) => {
    setGridSorts((sorts) => {
      let newSorts: GridSortItem[] = [];
      if (sort === "none") {
        newSorts = sorts.filter((item) => item.field !== field);
      } else {
        const itemIndex = sorts.findIndex((item) => item.field === field);
        if (itemIndex === -1) {
          if (multiSortable) {
            newSorts = [...sorts, { field, sort }];
          } else {
            newSorts = [{ field, sort }];
          }
        } else {
          newSorts = sorts.map((item, index) => {
            if (index === itemIndex) {
              return { field: item.field, sort: sort };
            }
            return { ...item };
          });
        }
      }
      loadGrid({
        pageIndex: selectedPage + 1,
        pageSize: pageSize === null ? 100000 : pageSize,
        sorts: newSorts,
      });
      return newSorts;
    });
  };

  useEffect(() => {
    const headers: ColHeader[] = colDefs.map((col) => {
      const sortItem = gridSorts.find((item) => item.field === col.field);
      const sort: SortStateType = sortItem ? sortItem.sort : "none";
      return {
        col: col,
        sort: sort,
      };
    });
    setColHeaders(headers);
  }, [gridSorts, colDefs]);

  useEffect(() => {
    loadGrid();
  }, [loadGrid]);

  useEffect(() => {
    setPageSize(defaultPageSize);
  }, [defaultPageSize]);

  useImperativeHandle(ref, () => ({
    refresh() {
      loadGrid();
    },
  }));

  {
    return (
      <div>
        <div className="overflow-x-auto w-full">
          <div>
            <Table hoverable className="text-right border border-gray-300">
              <Table.Head>
                {colHeaders.map((header, index) => (
                  <Table.HeadCell key={index}>
                    <GridHeaderComponent
                      colHeader={header}
                      onSortChange={onSortChange}
                    />
                  </Table.HeadCell>
                ))}
                {rowActions && <Table.HeadCell>عملیات</Table.HeadCell>}
                {/* <Table.HeadCell>عملیات</Table.HeadCell> */}
              </Table.Head>
              <Table.Body className="divide-y">
                {isPending && (
                  <Table.Row>
                    <Table.Cell
                      colSpan={colDefs.length + Number(Boolean(rowActions))}
                    >
                      <div className="flex justify-center py-12">
                        <SDSpinner color="blue" size={28} />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )}
                {!isPending &&
                  gridRows.map((row, index) => (
                    <GridRow
                      key={index}
                      row={row}
                      rowActions={rowActions}
                      onEditRow={onEditRow}
                      onRemoveRow={onRemoveRow}
                      onRowDobuleClisk={
                        onDoubleClick ? onRowDobuleClisk : undefined
                      }
                    />
                  ))}
              </Table.Body>
            </Table>
          </div>
        </div>
        {!!pageCount && pageCount > 1 && (
          <ReactPaginate
            breakLabel="..."
            forcePage={selectedPage}
            nextLabel={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            }
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            }
            renderOnZeroPageCount={null}
            containerClassName="flex gap-5  justify-end bg-gray-50 py-2 pl-4"
            nextClassName="flex items-center"
            previousClassName="flex items-center"
            pageLinkClassName="p-1 block hover:text-cyan-400 transition-all ease-linear duration-75"
            nextLinkClassName="p-1 block hover:text-cyan-400 transition-all ease-linear duration-75"
            previousLinkClassName="p-1 block hover:text-cyan-400 transition-all ease-linear duration-75"
            breakClassName="p-1 block hover:text-cyan-400"
            activeClassName="text-cyan-500"
            pageClassName="text-base "
          />
        )}
      </div>
    );
  }
}
const Grid = forwardRef(MainGrid) as <T = any>(
  props: GridProps<T> & { ref?: React.ForwardedRef<GridRef> }
) => ReturnType<typeof MainGrid>;
export default Grid;
