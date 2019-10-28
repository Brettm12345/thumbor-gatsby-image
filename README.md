# Thumbor TS Gatsby Image

Auto convert `thumbor-ts` instances into `gatsby-image` compatible objects

## Usage

```typescript
import Img from 'gatsby-image'
import { fixed, fluid } from 'thumbor-ts-gatsby-image';
import { Thumbor } from 'thumbor-ts';

// Your encryption key is not required, but your link will be unsafe.
const thumbor = new Thumbor('http://myserver.thumbor.com', 'MY_KEY');

// Set the image
const image = thumbor
    .setImagePath('00223lsvrnzeaf42.png')
    .smartCrop(true)

// Resize
const fixed = fixed(image, { width: 200, height: 300 })

// You can pass this to gatsby-image
const Img: React.FC = () => (
  <Img fixed={fixed} />
)
```
