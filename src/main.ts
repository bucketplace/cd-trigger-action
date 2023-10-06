import * as core from '@actions/core'
import {triggerCD} from './cd-trigger'

async function run(): Promise<void> {
  try {
    const application: string = core.getInput('application', {required: true})
    const profile: string = core.getInput('profile', {required: true})
    const imageTag: string = core.getInput('image-tag', {required: true})
    const version: string = core.getInput('version', {required: true})
    const env: string = core.getInput('env')
    const commitSha: string | undefined = core.getInput('commit-sha')
    const repoUrl: string | undefined = core.getInput('repo-url')

    core.debug(
      `Trigger CD for ${application}, profile: ${profile}, imageTag: ${imageTag}, version: ${version}, env: ${env}, commitSha: ${commitSha}, repoUrl: ${repoUrl}`
    )
    await triggerCD(application, {
      profile,
      image_tag: imageTag,
      version,
      env: env ? env : undefined,
      extra: {
        commit_sha: commitSha ? commitSha : undefined,
        repo_url: repoUrl ? repoUrl : undefined
      }
    })
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
