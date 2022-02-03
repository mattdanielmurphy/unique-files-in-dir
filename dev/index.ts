import { readdir } from 'fs/promises'
import { resolve } from 'path'

async function getFilePaths(dir: string) {
	dir = resolve(dir)
	const dirents = await readdir(dir, { withFileTypes: true })
	const files: any = await Promise.all(
		dirents.map((dirent) => {
			const res = resolve(dir, dirent.name)
			return dirent.isDirectory() ? getFilePaths(res) : res
		}),
	)
	return Array.prototype.concat(...files)
}

async function countFilesOfEachType(dir: string) {
	const files = await getFilePaths(dir)
	// const justNames = files.map((filePath) => filePath.replace(/.*\/(.*)/, '$1'))
	const names: { wav: number[]; mp3: number[] } = { wav: [], mp3: [] }

	files.forEach((filePath) => {
		const ghostNumberMatches = /#(\d{1,4})/.exec(filePath)
		const extensionMatches = /\.(.*)$/.exec(filePath)
		if (
			ghostNumberMatches &&
			extensionMatches &&
			(extensionMatches[1] === 'wav' || extensionMatches[1] === 'mp3')
		) {
			const ghostNumber = ghostNumberMatches[1]
			names[extensionMatches[1]].push(+ghostNumber)
		}
	})

	const uniqueNames: {
		wavSet?: Set<number>
		mp3Set?: Set<number>
		wav?: number[]
		mp3?: number[]
	} = {}

	uniqueNames.wavSet = new Set([...names.wav])
	uniqueNames.mp3Set = new Set([...names.mp3])

	uniqueNames.wav = [...uniqueNames.wavSet].sort((a, b) => a - b)
	uniqueNames.mp3 = [...uniqueNames.mp3Set].sort((a, b) => a - b)

	const allFilesInSession = {
		wav: uniqueNames.wav,
		mp3: uniqueNames.mp3,
	}

	console.log(allFilesInSession)

	const missingFiles: Array<string | number>[] = []

	for (let i = 0; i < 10; i++) {
		console.log(`\n${i * 1000 + 1} to ${(i + 1) * 1000}`)
		// const filesInGroupOf1000
		missingFiles[i] = []
		for (let j = 0; j < 1000; j++) {
			const index = i * 1000 + j + 1

			const wasIncluded = (index: number) =>
				allFilesInSession.wav.includes(index)

			const notIncluded = !wasIncluded(index)
			// const prevValue =
			// 	i > 0 && j === 0
			// 		? missingFiles[i - 1][missingFiles[i - 1].length]
			// 		: missingFiles[i][missingFiles[i].length - 1]

			const prevValue = missingFiles[i][missingFiles[i].length - 1]
			const prevValueIsEllipsis = prevValue === '...'
			const prevValueNotIncluded = !wasIncluded(index - 1)

			if (notIncluded) {
				if (prevValueIsEllipsis) {
					if (j === 999) missingFiles[i].push(index)
				} else if (prevValueNotIncluded && j > 0) {
					missingFiles[i].push('...')
				} else {
					missingFiles[i].push(index)
				}
			} else if (prevValueIsEllipsis) {
				missingFiles[i].push(index - 1)
			}
		}
	}
	console.log(missingFiles)

	// concatenate spans of sequential numbers
}
// ? =============================================================================
// ?  START     START     START     START     START     START     START     START
// ? 			 START     START     START     START     START     START     START
// ?  START     START     START     START     START     START     START     START
// ? =============================================================================

const dir = process.argv[2]
if (!dir) throw Error('please provide a directory')

countFilesOfEachType(dir)
