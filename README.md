# responsive-watch

Watch some media queries and react when they change.

## Install

```bash
npm install responsive-watch --save
```

## Usage

```javascript
import responsiveWatch from 'responsive-watch';

const watchers = responsiveWatch({
  sizes: [
    {name: 'small', breakpoint: 40, unit: 'em'},
    {name: 'medium', breakpoint: 70, unit: 'em'},
    {name: 'large'}
  ],
  orientations: true,
  queries: {
    smallTelevision: 'tv and (max-device-height: 30cm)'
  }
}, (status)=> {
  // Called every time one of the media query results changes
  // (also called once at init)

  // Example on a television with 60em width and 25cm height
  console.log(status);
  // {
  //   sizes: {
  //     small: false,
  //     medium: true,
  //     large: false
  //   },
  //   orientations: {
  //     landscape: true,
  //     portrait: false
  //   },
  //   queries: {
  //     smallTelevision: true
  //   },
  //   lt: { small: false, medium: false, large: true },
  //   lte: { small: false, medium: true, large: true },
  //   gt: { small: true, medium: false, large: false },
  //   gte: { small: true, medium: true, large: false }
  // }
});

// You can access the current status at any time
watchers.status();
```

## FAQ

**Does it support IE6?** Not out of the box. It only needs the `matchMedia` function. You can find great [polyfills](https://github.com/paulirish/matchMedia.js) online.

**Is it possible to have multiple instances of responsive watch?** Yes. Just call the `responsiveWatch` as many time as you need.

**Could you describe a use case for this lib?** I'm using it inside my React applications. When I need responsive inline styles, I plug the lib with my Flux dispatcher so each time the callback is called, it will update a store and impact all my components to re-render with the new style.

## API

`responsiveWatch(options, callback)`

Return an object with one method `status` which return the current status.

### options

- `sizes` (default `[]`): an array of `{name, breakpoint, unit}`. The breakpoint is the max width before switching to the next size. This is why the last size doesn't need any breakpoint. You can mix different units but shouldn't do it.
- `orientations` (default `true`): a boolean to enable or disable orientation watchers. Results are in `status.orientations.landscape` and `status.orientations.portrait`.
- `medias` (default `true`): a boolean to enable or disable media watchers (screen, print, tv, ...). Results are in `status.medias`.
- `queries` (default `[]`): an array of `{name, query}`. You can create custom media queries. The result will be in `status.querys[name]`.
- `check` (default `true`): enable or disable all checks to see if options seems valid.

**Warning** There is no check to test if all size breakpoints are each bigger than the previous one if you mix different units inside your sizes. That's because it would be just impossible since some units are not absolute.

### callback

Invoked once when initializing the responsive watch and then every time a media query match changes. Receive one argument which is the current status.

### status

An object with map your options to a boolean depending if the media query currently matches or not. The structure is the following (it's a bit complex to explain with words but I'm pretty sure the example right after will make everything way easier):

- `sizes`: for each `options.size`, will create a key with the name of the size. Among all sizes, only one can be `true` while all other will be `false`.
- `orientations`: got two keys, `landscape` and `portrait`, one `true` and the other `false` depending on the screen.
- `queries`: for each `options.queries`, will create a key with the name of the query and the value will be if it currently matches or not.
- `lt`, `lte`, `gt`, `gte`: each of those keys will contains an object with all the size names. Each one indicates if we are currently lower than (`lt`), lower or equal than (`lte`), greater than (`gt`) or greater or equal than (`gte`) compared to the current size. For example, if `status.lte.medium` is true, it means the width of the screen is currently smaller or equal to the medium size.

```javascript
{
  sizes: {
    small: false,
    medium: true,
    large: false
  },
  orientations: {
    landscape: true,
    portrait: false
  },
  medias: {
    braille: false,
    embossed: false,
    handheld: false,
    print: false,
    projection: false,
    screen: true,
    speech: false,
    tty: false,
    tv: false
  },
  queries: {
    smallTelevision: true,
    print: false,
    highDpi: true
  },
  lt: { small: false, medium: false, large: true },
  lte: { small: false, medium: true, large: true },
  gt: { small: true, medium: false, large: false },
  gte: { small: true, medium: true, large: false }
}
```

## Examples

Coming soon...
