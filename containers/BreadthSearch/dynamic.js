import {h} from 'preact' //eslint-disable-line

import Canvas from 'components/Canvas'

export default function Dynamic () {
  return (
    <section>
      <Canvas attributes={{height: '500', width: '800'}} />
    </section>
  )
}
