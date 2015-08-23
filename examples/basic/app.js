import responsiveWatch from 'responsiveWatch';

const options = {
  sizes: [
    {name: 'xsmall', breakpoint: 34, unit: 'em'},
    {name: 'small', breakpoint: 48, unit: 'em'},
    {name: 'medium', breakpoint: 62, unit: 'em'},
    {name: 'large', breakpoint: 75, unit: 'em'},
    {name: 'xlarge'}
  ],
  queries: {
    lowDPI: '(max-resolution: 199dpi)',
    mediumDPI: '(min-resolution: 200dpi) and (max-resolution: 399dpi)',
    highDPI: '(min-resolution: 400dpi)'
  }
};

responsiveWatch(options, (status)=> {
  let html = '<h1>Basic example</h1>';

  html += '<p>Try to resize your browser and enjoy the show.</p>';

  // Sizes
  html += '<section><h2>Sizes</h2><ul>';

  options.sizes.forEach(size=> {
    html += `<li class="${status.sizes[size.name] ? 'active': ''}">${size.name}</li>`;
  });

  html += '</ul></section>';

  // Orientations
  html += '<section><h2>Orientations</h2><ul>';

  ['portrait', 'landscape'].forEach(orientation=> {
    html += `<li class="${status.orientations[orientation] ? 'active': ''}">${orientation}</li>`;
  });

  html += '</ul></section>';

  // DPI
  html += '<section><h2>DPI</h2><ul>';

  ['lowDPI', 'mediumDPI', 'highDPI'].forEach(dpi=> {
    html += `<li class="${status.queries[dpi] ? 'active': ''}">${dpi}</li>`;
  });

  html += '</ul></section>';

  // Comparators
  html += '<section><h2>Comparators</h2><ul>';

  ['lt', 'lte', 'gte', 'gt'].forEach(comp=> {
    html += '<ul><li class="title">' + comp + '</li>';
    options.sizes.forEach(size=> {
      html += `<li class="${status[comp][size.name] ? 'active': ''}">${size.name}</li>`;
    });
    html += '</ul>';
  });

  html += '</section>';

  // Raw status
  html += '<section><h2>Status</h2><pre><code>';
  html += JSON.stringify(status, null, 2);
  html += '</code></pre></section>';

  document.getElementById('content').innerHTML = html;
});
