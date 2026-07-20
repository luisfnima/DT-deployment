export interface ICRMProvider {
  fetchData(reportName: string): Promise<any>;
}
