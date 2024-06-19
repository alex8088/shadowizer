#!/usr/bin/env node

import fs from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { glob } from 'fast-glob'
import { cac } from 'cac'
import colors from 'picocolors'

import { version } from '../package.json'
import { saveShadowImage } from './index'

import type { ShadowOptions } from './types'

const cli = cac('shadowizer')

type CLIOptions = {
  f?: string[]
  files?: string[]
  c?: string
  shadowColor?: string
  b?: number
  shadowBlur?: number
  x?: number
  shadowOffsetX?: number
  y?: number
  shadowOffsetY?: number
}

cli.option('-f, --files [...files]', `[string[]] specify images, support glob`)
cli.option(
  '-c, --shadowColor <shadowColor>',
  `[string] set shadow color, default: #00000073`
)
cli.option(
  '-b, --shadowBlur <shadowBlur>',
  `[number] set shadow blur, default: 25`
)
cli.option(
  '-x, --shadowOffsetX <shadowOffsetX>',
  `[number] set shadow offset x, default: 0`
)
cli.option(
  '-y, --shadowOffsetY <shadowOffsetY>',
  `[number] set shadow offset y, default: 0`
)

cli
  .command('[root]', 'find images and add a box shadow to them')
  .action(async (root: string, options: CLIOptions) => {
    const dir = root ? resolve(root) : process.cwd()

    const { files, shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY } =
      options

    const images = await glob(files || ['*.{png,webp,jpg,jpeg}'], {
      deep: 0,
      onlyFiles: true,
      cwd: dir
    })

    const shadowOptions: ShadowOptions = {
      color: shadowColor,
      blur: shadowBlur,
      offsetX: shadowOffsetX,
      offsetY: shadowOffsetY
    }

    const outDir = join(dir, `shadow-image-${+new Date()}`)
    await fs.mkdir(outDir)

    console.log()

    let count = 0
    let added = 0
    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      try {
        const su = await saveShadowImage(
          join(dir, image),
          outDir,
          shadowOptions
        )
        if (su) {
          count += 1
          added += 1
        } else {
          console.log(
            `${colors.cyan('●')}  ${image} > ${colors.yellow('Non-image')}\n`
          )
        }
      } catch (err) {
        count += 1
        console.log(
          `${colors.cyan('●')}  ${image} > ${colors.red((err as Error).message)}\n`
        )
      }
    }

    console.log(
      colors.bold(
        `${colors.green('✓')}  Found ${colors.cyan(count)} images, ${colors.cyan(added)} added`
      )
    )
    console.log()
  })

cli.help()
cli.version(version)

cli.parse()
