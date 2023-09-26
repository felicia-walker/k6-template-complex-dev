import { RefinedResponse, ResponseType } from 'k6/http';
import { Trend } from 'k6/metrics';
export default class SampleService {
    protected delay: number;
    constructor(delay?: number);
    loadK6Page(...trends: Trend[]): RefinedResponse<ResponseType | undefined>;
}
