# Thumbor TS Gatsby Image

Auto convert `thumbor-ts` instances into `gatsby-image` compatible objects

## Usage

```typescript
import React, { FC } from 'react'
import Img from 'gatsby-image'
import { useFixed } from 'thumbor-ts-gatsby-image';
import { Thumbor } from 'thumbor-ts';

// Your encryption key is not required, but your link will be unsafe.
const thumbor = new Thumbor('http://myserver.thumbor.com', 'MY_KEY');

const image = thumbor
    .setImagePath('00223lsvrnzeaf42.png')
    .smartCrop(true)

const Img: FC = () => {
  const fixed = useFixed(image, { width: 200, height: 300 })
  return (
    <Img fixed={fixed} />
  )
}
```
