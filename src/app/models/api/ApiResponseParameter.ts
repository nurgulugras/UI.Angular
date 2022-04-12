import { ResultType } from "../enums/ResultType.enum";

export class ApiResponseParameter<TData> {
  public httpStatusCode: number;
  public resultType: ResultType;
  public requestIdentifier: string;
  public message: string;
  public dataModel: TData;
}
