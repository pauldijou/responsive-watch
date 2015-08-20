const units = ['px', 'em', 'rem', 'ex', 'ch', 'mm', 'cm', 'in', 'pt', 'pc'];

export default function responsiveWatch({ sizes = [], orientations: true, queries: [], check: true }, cb) {
  if (size.length === 1) {
    throw new Error('If you specify some sizes, you need at least two of them.');
  }

  if (check) {
    sizes.forEach((size, index) {
      if (typeof size.name !== 'string') {
        throw new Error(`Size names must be string. Invalid: ${size.name}`);
      }

      if (index < sizes.length - 1) {
        if (typeof size.breakpoint !== 'number') {
          throw new Error(`Size [${size.name}] must have a number breakpoint. Invalid: ${size.breakpoint}`);
        } else if (units.indexOf(size.unit) < 0) {
          throw new Error(`Size [${size.name}] doesn't have a valid unit. Invalid: ${size.unit}`);
        } else if (size.breakpoint <= 0) {
          throw new Error(`Size [${size.name}] must have a strictly positive breakpoint. Invalid: ${size.unit}`);
        }
      } else {
        // Last size
        if (size.breakpoint !== undefined || size.unit !== undefined) {
          throw new Error('You must not define neither breakpoint nor unit for the last size');
        }
      }
    });

    // If all units are the same,
    // check that each breakpoint is bigger than the previous one
    for (let i = 1, l = sizes.length - 1; i < l; ++i) {
      const previous = sizes[i - 1], current = sizes[i];
      if (current.unit !== previous.unit) {
        // Not all same units, let's stop here
        break;
      } else if (current.breakpoint <= previous.breakpoint) {
        // Oops...
        throw new Error('Each breakpoint must be bigger than the previous one.');
      }
    }
  }

  let currentStatus;

  function callback() {
    currentStatus = status();
    cb(currentStatus);
  }

  const watchers = {
    sizes: {},
    orientations: {},
    queries: {}
  };

  // Create all size watchers
  sizes.forEach((size, index)=> {
    let min, minUnit, max, maxUnit;

    // The min is actually the previous size breakpoint
    if (index > 0) {
      min = sizes[index - 1].breakpoint;
      minUnit = sizes[index - 1].unit;
    }

    // The max is the current size minus a little delta
    if (index < sizes.length - 1) {
      max = size.breakpoint;
      maxUnit = size.unit;

      switch (maxUnit) {
        case 'cm':
        case 'in':
          max -= 0.01;
          break;
        case 'em':
        case 'rem':
        case 'ex':
        case 'ch':
        case 'mm':
        case 'pt':
        case 'pc':
          max -= 0.1;
          break;
        default:
          max -= 1;
      }
    }

    // Merge min and max to create the final query
    let query = '';
    if (min !== undefined) {
      query += `(min-width: ${min}${minUnit})`;
    }
    if (max !== undefined) {
      if (query !== '') {
        query += ' and ';
      }
      query += `(max-width: ${max}${maxUnit})`;
    }

    watchers.sizes[size.name] = matchMedia(query);
    watchers.sizes[size.name].addListener(callback);
  });

  // Create both landscape and portrait watchers
  if (orientations) {
    watchers.orientations.landscape = matchMedia('(orientation: landscape)');
    watchers.orientations.landscape.addListener(callback);

    watchers.orientations.portrait = matchMedia('(orientation: portrait)');
    watchers.orientations.portrait.addListener(callback);
  }

  // Create all custom watchers
  queries.forEach(query=> {
    watchers.orientations[query.name] = matchMedia(query.query);
    watchers.orientations[query.name].addListener(callback);
  });

  // Save all keys just so we don't have to compute them every time
  const keys = {
    sizes: Object.keys(watchers.sizes),
    orientations: Object.keys(watchers.orientations),
    queries: Object.keys(watchers.queries)
  };

  function matchSizes(sizes) {
    return sizes.reduce((acc, size)=> acc || this[size], false);
  }

  const sizeUtils = {
    gt: (size)=> matchSizes(sizes.slice(sizes.indexOf(size) + 1)),
    gte: (size)=> matchSizes(sizes.slice(sizes.indexOf(size))),
    lt: (size)=> matchSizes(sizes.slice(0, sizes.indexOf(size))),
    lte: (size)=> matchSizes(sizes.slice(0, sizes.indexOf(size) + 1))
  };

  // Generate the current status
  function status() {
    const result = {};

    // Assign a bunch of true/false flags for all media queries
    Object.keys(keys).forEact(level1=> {
      keys[level1].forEach(level2=> {
        if (!result[level1]) {
          result[level1] = {};
        }

        result[level1][level2] = watchers[level1][level2].matches;
      });
    });

    // Add all size comparators
    if (keys.sizes.length > 1) {
      ['gt', 'gte', 'lt', 'lte'].forEach(comp=> {
        keys.sizes.forEach(size=> {
          if (!result[comp]) {
            result[comp] = {};
          }

          result[comp][size] = sizeUtils[comp](size);
        });
      });
    }

    return result;
  }

  // Init callback
  callback();

  return {
    status: ()=> currentStatus
  };
};
