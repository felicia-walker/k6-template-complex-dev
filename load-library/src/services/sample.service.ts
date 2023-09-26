import http, { RefinedResponse, ResponseType } from 'k6/http'
import { check, sleep } from 'k6'
import { Trend } from 'k6/metrics'

export default class SampleService {
  protected delay = 1

  constructor(delay = 1) {
    this.delay = delay
  }

  public loadK6Page(...trends: Trend[]): RefinedResponse<ResponseType | undefined> {
    const res = http.get('https://test.k6.io')
    sleep(this.delay)

    trends.forEach((trend: Trend) => {
      trend.add(res.timings.waiting)
    })

    check(res, {
      'K6 page request accepted': r => r.status === 200,
      'K6 page content returned': r => r.body != null && r.body.length > 0,
    })

    return res
  }
}
