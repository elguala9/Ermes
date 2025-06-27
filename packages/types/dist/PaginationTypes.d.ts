export type PaginationDTO<ListType, CursorType> = {
    cursor: CursorType;
    pageSize: number;
    totalItems: number;
    eof: boolean;
    items: ListType[];
    nextCursor: CursorType;
};
