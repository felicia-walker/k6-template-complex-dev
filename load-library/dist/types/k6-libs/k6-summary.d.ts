export function humanizeValue(val: any, metric: any, timeUnit: any): string;
declare function generateTextSummary(data: any, options: any): string;
declare function generateCsvSummary(data: any, options: any): string;
declare function generateJUnitXML(data: any, options: any): string;
export { generateTextSummary as textSummary, generateCsvSummary as csvSummary, generateJUnitXML as jUnit };
