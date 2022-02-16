import { readdir } from 'fs/promises'
import { resolve } from 'path'
let dirsRead = 0
// async function getFilePaths(dir: string) {
// 	dir = resolve(dir)
// 	const dirents = await readdir(dir, { withFileTypes: true })
// 	dirsRead++
// const files: any = await Promise.all(
// 	dirents.map((dirent) => {
// 		const res = resolve(dir, dirent.name)
// 		if (dirsRead === 3) {
// 			console.log(res)
// 		}

// 		return dirent.isDirectory() ? getFilePaths(res) : res
// 	}),
// )
// return Array.prototype.concat(...files)
// }

async function getFoldersWithout8Files(dir: string) {
	const dirents = await readdir(dir, { withFileTypes: true })
	console.log(`===================================
    DIRS WITHOUT 8 AUDIO FILES:
===================================
 file name | number of audio files 
-----------------------------------`)

	for (const dirent of dirents) {
		const res = resolve(dir, dirent.name)

		if (dirent.isDirectory()) {
			const allFiles = await readdir(res)
			const audioFiles = allFiles.filter(
				(file) =>
					!file.startsWith('.') &&
					(file.endsWith('.wav') || file.endsWith('.mp3')),
			)
			if (audioFiles.length !== 8) {
				console.log(
					' ' + dirent.name.slice(0, 9), //?  limit name length
					' '.repeat(9 + 1 - dirent.name.slice(0, 9).length), //?  add remainder of spaces for slice
					audioFiles.length,
				)
			}
		}
	}
}

const dir = process.argv[2]
if (!dir) throw Error('please provide a directory')

getFoldersWithout8Files(dir)
