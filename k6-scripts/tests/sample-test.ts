import { Trend } from 'k6/metrics'
import { handleSummary as customSummaryHandler } from 'load-library/dist/esm /util/util'
import SampleService from 'load-library/dist/esm/services/sample.service'

const k6PageTrend = new Trend('k6_page')

export default function () {
    const sampleService = new SampleService(5)

    for (var i = 0; i < 5; i++) {
        sampleService.loadK6Page(k6PageTrend)
    }
}

export function handleSummary(data: any) {
    return customSummaryHandler(data)
}
