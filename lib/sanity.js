import {
  groq,
  createClient,
  // createImageUrlBuilder,
  createPreviewSubscriptionHook,
} from 'next-sanity'

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  // useCdn: process.env.NODE_ENV === 'production',
  useCdn: false,
  // apiVersion: "2021-03-25",
  apiVersion: "v1",
}

// export const imageBuilder = source => createImageUrlBuilder(config).image(source)
export const usePreviewSubscription = createPreviewSubscriptionHook(config)
// export const client = createClient(config)
// console.log(client)
// export const previewClient = createClient({
//   ...config,
//   useCdn: false,
//   token: process.env.SANITY_API_TOKEN,
// })

// export const getClient = (usePreview) => (usePreview ? previewClient : client)
// export default client