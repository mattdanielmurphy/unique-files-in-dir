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
	console.log('==============================')
	console.log('    DIRS WITHOUT 8 FILES:')
	console.log('==============================')
	console.log(' file name | number of files ')
	console.log('------------------------------')
	for (const dirent of dirents) {
		const res = resolve(dir, dirent.name)

		if (dirent.isDirectory()) {
			const files = await readdir(res)
			if (files.length !== 8) {
				console.log(
					' ' + dirent.name.slice(0, 9),
					' '.repeat(9 + 1 - dirent.name.slice(0, 9).length),
					files.length,
				)
			}
		}
	}
}

const dir = process.argv[2]
if (!dir) throw Error('please provide a directory')

getFoldersWithout8Files(dir)
