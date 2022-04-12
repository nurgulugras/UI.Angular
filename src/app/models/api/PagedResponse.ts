export class PagedResponse<TResultModel> {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    data: TResultModel;
}
