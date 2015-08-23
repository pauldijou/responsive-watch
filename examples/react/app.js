import React from 'react';
import { Component } from 'react';
import ReactDom from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { connect, Provider } from 'react-redux';
import { createAction, createReducer } from 'redux-act';
import responsiveWatch from 'responsive-watch';

// Flux configuration
const updateMedias = createAction('Media queries have changed');

const reducer = createReducer({
  [updateMedias]: (state, status)=> status
}, {});

const store = createStore(combineReducers({
  media: reducer
  // In your real app, you would have other reducers of course
}));

// Auto dispatch actions
updateMedias.bindTo(store);

// Create media watchers
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
    highDPI: '(min-resolution: 400dpi)',
    collapse: '(max-width: 40em)'
  }
};

responsiveWatch(options, updateMedias);

// Create UI
@connect(state=> ({media: state.media}))
class Item extends Component {
  render () {
    const style = {
      display: 'inline-block',
      padding: 20,
      fontWeight: 700,
      color: '#eee',
      backgroundColor: '#c0392b'
    };

    if (this.props.active) {
      style.backgroundColor = '#27ae60';
    }

    if (this.props.title) {
      style.backgroundColor = '#2c3e50';
      style.width = 50;
    }

    if (this.props.media.queries.collapse) {
      style.display = 'block';
      style.width = '80%';
      style.margin = this.props.title ? '20px auto 0' : '0 auto';
    }

    return <li style={style}>{this.props.title || this.props.children}</li>
  }
}

@connect(state=> ({media: state.media}))
class App extends Component {
  render () {
    const status = this.props.media;

    const sizes = options.sizes.map(size=> <Item key={size.name} active={status.sizes[size.name]}>{size.name}</Item>);

    const comparators = ['lt', 'lte', 'gte', 'gt'].map(comp => {
      const compSizes = options.sizes.map(size=>
        <Item key={size.name} active={status[comp][size.name]}>{size.name}</Item>
      );

      return (<ul key={comp}>
        <Item key='title' title={comp}></Item>
        {compSizes}
      </ul>);
    });

    return (<div>
      <h1>React example</h1>
      <p>Try to resize your browser and enjoy the show.</p>
      <section>
        <h2>Sizes</h2>
        <ul>{sizes}</ul>
      </section>
      <section>
        <h2>Orientations</h2>
        <ul>
          <Item active={status.orientations.portrait}>Portrait</Item>
          <Item active={status.orientations.landscape}>Landscape</Item>
        </ul>
      </section>
      <section>
        <h2>DPI</h2>
        <ul>
          <Item active={status.queries.lowDPI}>Low DPI</Item>
          <Item active={status.queries.mediumDPI}>Medium DPI</Item>
          <Item active={status.queries.highDPI}>High DPI</Item>
        </ul>
      </section>
      <section>
        <h2>Comparators</h2>
        {comparators}
      </section>
      <section>
        <h2>Status</h2>
        <pre><code>{JSON.stringify(this.props.media, null, 2)}</code></pre>
      </section>
    </div>)
  }
}

ReactDom.render((
  <Provider store={store}>
    {() => <App />}
  </Provider>
), document.getElementById('content'));
