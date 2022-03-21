import type { NextApiRequest, NextApiResponse } from 'next'
import { v1 } from "@datadog/datadog-api-client";

const configuration = v1.createConfiguration();
const apiInstance = new v1.MetricsApi(configuration);

const metrics = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
      const { userCountry, meshID, timestamp, latency } = req.body
      const params: v1.MetricsApiSubmitMetricsRequest = {
        body: {
          series: [
            {
              metric: "vhq.latency",
              type: "gauge",
              points: [[timestamp / 1000, latency]],
              tags: [`country:${userCountry}`, `mesh:${meshID}`],
            },
          ],
        },
      };
    

      try {
      const data: v1.IntakePayloadAccepted = await apiInstance
        .submitMetrics(params);
        res.status(200).json(data)
      } catch(error: any) {
        res.status(500).json({ err: error})
      };
  } else {
      res.status(405).json({})
  }
}

export default metrics