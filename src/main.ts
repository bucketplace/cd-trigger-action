import * as core from '@actions/core'
import {triggerCD} from './cd-trigger'

async function run(): Promise<void> {
  try {
    const profile: string = core.getInput('profile', {required: true})
    const manifestPath: string = core.getInput('manifest-path', {
      required: true
    })
    const manifestRepo: string = core.getInput('manifest-repo')
    const imageTag: string = core.getInput('image-tag', {required: true})
    const version: string = core.getInput('version')

    core.debug(
      `Trigger CD to ${manifestPath}, profile: ${profile}, imageTag: ${imageTag}, version: ${version}`
    )
    await triggerCD({
      profile,
      manifest_path: manifestPath,
      manifest_repo: manifestRepo ? manifestRepo : undefined,
      image_tag: imageTag,
      version: version ? version : undefined
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
