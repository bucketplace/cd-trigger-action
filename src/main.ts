import * as core from '@actions/core'
import {triggerCD} from './cd-trigger'

async function run(): Promise<void> {
  try {
    const application: string = core.getInput('application', {required: true})
    const profile: string = core.getInput('profile', {required: true})
    const imageTag: string = core.getInput('image-tag', {required: true})
    const version: string = core.getInput('version', {required: true})

    core.debug(
      `Trigger CD for ${application}, profile: ${profile}, imageTag: ${imageTag}, version: ${version}`
    )
    await triggerCD(application, {
      profile,
      image_tag: imageTag,
      version
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
