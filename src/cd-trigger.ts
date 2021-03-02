import fetch from 'node-fetch'

function getBaseUrl(): string {
  let url = process.env.BASE_URL
  if (!url)
    throw ReferenceError('There is no url defined in the environment variables')
  if (url.endsWith('/')) url = url.slice(0, -1)
  return url
}

function getAuthToken(): string {
  const token = process.env.AUTH_TOKEN
  if (!token)
    throw ReferenceError(
      'There is no token defined in the environment variables'
    )
  return token
}

// eslint-disable-next-line @typescript-eslint/promise-function-async
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function checkTriggerStatus(buildNum: number): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/cd/trigger/${buildNum}/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${getAuthToken()}`
    }
  })

  if (res.status === 202) {
    await sleep(1000)
    await checkTriggerStatus(buildNum)
  } else if (res.status !== 200) throw Error((await res.json())?.message)
}

export async function triggerCD(body: {
  profile: string
  manifest_path: string
  image_tag: string
  version?: string
}): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/cd/trigger`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${getAuthToken()}`
    },
    body: JSON.stringify(body)
  })

  if (res.status !== 200) throw Error((await res.json())?.message)

  const buildNum: number = (await res.json())?.build_num
  await checkTriggerStatus(buildNum)
}
