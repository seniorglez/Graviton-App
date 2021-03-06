import * as path from 'path'
import * as fs from 'fs-extra'
import { ipcRenderer } from 'electron'

const CustomWindow: any = window

const getConfig = () => {
	return ipcRenderer.invoke('get-config')
}

const getDefaultConfig = () => {
	return ipcRenderer.invoke('get-default-config')
}

const isDev = () => {
	return ipcRenderer.invoke('is-dev')
}

const getProcessArguments = () => {
	return ipcRenderer.invoke('get-process-arguments')
}

process.once('loaded', async () => {
	const config = await getConfig()

	CustomWindow.graviton = {
		AppConfig: config,
		DefaultAppConfig: await getDefaultConfig(),
		runtime: {
			isDev: await isDev(),
			processArguments: await getProcessArguments(),
		},
	}

	const gravitonConfigPath = config.appConfigPath
	const gravitonPluginsPath = path.join(gravitonConfigPath, 'plugins')

	//If .graviton2 doesn't exist, create it
	if (!fs.existsSync(gravitonConfigPath)) {
		await fs.mkdir(gravitonConfigPath)
	}

	//If .graviton2/plugins doesn't exist, create it
	if (!fs.existsSync(gravitonPluginsPath)) {
		await fs.mkdir(gravitonPluginsPath)
	}
})
