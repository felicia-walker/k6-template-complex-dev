import { csvSummary, jUnit, textSummary } from '../k6-libs/k6-summary'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleSummary(data: any) {
  const summary: { [key: string]: string } = {}
  let showColors = true

  if (__ENV.UPLOAD_RESULTS === 'true') {
    showColors = false
    const outdir = __ENV.OUT_DIR ?? '.'
    summary[`${outdir}/junit.xml`] = jUnit(data, null)
    summary[`${outdir}/summary.csv`] = csvSummary(data, null)
    summary[`${outdir}/summary.txt`] = textSummary(data, { indent: ' ', enableColors: false })
  } else {
    summary.stdout = textSummary(data, { indent: ' ', enableColors: showColors })
  }

  return summary
}
