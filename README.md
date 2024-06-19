<h1 align="center">shadowizer</h1>

<p align="center">A cli tool for adding box shadow to images</p>

<p align="center">
<img src="https://img.shields.io/npm/v/shadowizer?color=orange&label=version">
<img src="https://img.shields.io/github/license/alex8088/shadowizer?color=blue" alt="license" />
</p>

<pre align="center">npm i -g <b>shadowizer</b></pre>

<p align='center'><b>Before</b></p>

<p align='center'>
<img src='./screenshots/before.png'/>
</p>

<p align='center'><b>After</b></p>

<p align='center'>
<img src='./screenshots/after.png'/>
</p>

## Usage

See `shadowizer --help` for more details

### shadowizer [root]

Find images and add box shadow to them. You can specify the root directory, which can be an absolute path, or a path relative to the current working directory. Default to `process.cwd()`.

| Options                | Description                            |
| ---------------------- | :------------------------------------- |
| `-f, --files`          | specify images                         |
| `-c, --shadowColor`    | set shadow color, default: `#00000073` |
| `-b, --shadowBlur`     | set shadow blur, default: `25`         |
| `-x, --shadowOffsetX`  | set shadow offset x, default: `0`      |
| `-y, --shadowOffsetY ` | set shadow offset y, default: `0`      |

Example：

```sh
# Specify multiple images
shadowizer -f text.png -f fun.png

# Specify images using glob
shadowizer -f *.png

# Specify shadow color
shadowizer -c #00000073
```

## API

### addShadow

- type: `(imagePath: string, shadow?: ShadowOptions) => Promise<void | Buffer>`

Adds a box shadow to the specified image.

```js
import { addShadow } from 'shadowizer'
```

### saveShadowImage

- type: `(imagePath: string, outDir?: string, shadow?: ShadowOptions) => Promise<boolean>`

Adds a box shadow to the specified image and saves it to disk.

```js
import { saveShadowImage } from 'shadowizer'
```

## License

[MIT](./LICENSE) © alex.wei
