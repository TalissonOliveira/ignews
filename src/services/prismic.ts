import * as prismic from '@prismicio/client'

export function getPrismicClient(req?: unknown) {
  const Prismicclient = prismic.createClient(
    process.env.PRISMIC_ENDPOINT,
    {
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    }
  )

  return Prismicclient
}