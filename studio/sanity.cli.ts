import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '1qxvh1it',
    dataset: 'production'
  },
  studioHost: 'alvaroartiel',
  deployment: {
    appId: 'lhgjd684l7kzyojdbj69kv79',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
