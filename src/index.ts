import fs from 'node:fs/promises'
import { join, basename, extname } from 'node:path'
import { createCanvas, loadImage } from '@napi-rs/canvas'

import type { ShadowOptions } from './types'

export * from './types'

export async function addShadow(
  imagePath: string,
  shadow?: ShadowOptions
): Promise<void | Buffer> {
  const {
    color = '#00000073',
    blur = 25,
    offsetX = 0,
    offsetY = 0
  } = shadow || {}

  const maxSize = Math.max(blur, offsetX, offsetY)

  const margin = Math.floor(maxSize / 5)

  const shadowAreaSize = maxSize + margin

  const ext = extname(imagePath).replace('.', '').replace('jpg', 'jpeg')

  if (ext === 'png' || ext === 'jpeg' || ext === 'webp') {
    const image = await loadImage(imagePath)

    const { height, width } = image

    const canvas = createCanvas(
      width + shadowAreaSize * 2,
      height + shadowAreaSize * 2
    )

    const ctx = canvas.getContext('2d')

    ctx.shadowColor = color
    ctx.shadowBlur = blur
    ctx.shadowOffsetX = offsetX
    ctx.shadowOffsetY = offsetY

    const dx = shadowAreaSize
    const dy = shadowAreaSize

    ctx.drawImage(image, dx, dy, width, height)

    return ext === 'png' ? canvas.encode(ext) : canvas.encode(ext)
  }
}

export async function saveShadowImage(
  imagePath: string,
  outDir: string = process.cwd(),
  shadow?: ShadowOptions
): Promise<boolean> {
  const buffer = await addShadow(imagePath, shadow)

  if (buffer) {
    await fs.writeFile(join(outDir, basename(imagePath)), buffer)
    return true
  }

  return false
}
