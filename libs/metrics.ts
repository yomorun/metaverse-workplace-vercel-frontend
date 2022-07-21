/**
 * Add latency to Datadog Metrics
 * @param userCountry user's country code
 * @param meshID MeshID
 * @param latency latency (ms)
 */
export async function addLatencyMetric(userCountry: string, meshID: string, timestamp: number, latency: number) {
  fetch('/api/metrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userCountry,
      meshID,
      timestamp,
      latency,
    }),
  })
}
