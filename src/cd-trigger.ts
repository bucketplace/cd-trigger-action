import fetch from 'node-fetch'

interface ExtraProps {
  commit_sha?: string
  repo_url?: string
}

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getErrorMsg(obj: any): string {
  return obj.detail || JSON.stringify(obj, null, 2)
}

// eslint-disable-next-line @typescript-eslint/promise-function-async
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function triggerCD(
  application: string,
  body: {
    profile: string
    image_tag: string
    version: string
    env?: string
    extra?: ExtraProps
  },
  retry_cnt = 0
): Promise<void> {
  if (retry_cnt > 30) throw Error('max retry attempts over!')

  const res = await fetch(
    `${getBaseUrl()}/api/v1/applications/${application}/cd-trigger/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${getAuthToken()}`
      },
      body: JSON.stringify(body)
    }
  )

  if (res.status === 409) {
    await sleep(1000)
    await triggerCD(application, body, retry_cnt + 1)
  } else if (res.status !== 200) throw Error(getErrorMsg(await res.json()))
}
