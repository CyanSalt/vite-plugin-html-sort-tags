# vite-plugin-html-sort-tags

[![npm](https://img.shields.io/npm/v/vite-plugin-html-sort-tags.svg)](https://www.npmjs.com/package/vite-plugin-html-sort-tags)

Vite plugin for sorting head tags in HTML.

## Motivation

Handling the order of tags in HTML correctly can sometimes help page performance and user experience. For example,

- Vite adds `link` tags with `modulepreload` to the end of the head in HTML by default, which can cause preloading to be deferred if head contains other non-async scripts;

- According to the principle of Browser Resource Hints, `link` tags with `dns-prefetch` and `preconnect` should obviously be added first, `preload` second, and `prefetch` third; and they should all go before resource tags.

The plugin has a default configuration that sorts the tags in the head in what is usually the best order.

## Installation

```shell
npm install --save-dev vite-plugin-html-sort-tags
```

## Usage

```js
// vite.config.js
import htmlSortTags from 'vite-plugin-html-sort-tags'

export default {
  plugins: [
    htmlSortTags(),
  ],
}
```

## Options

### `order`

- **Type:** `(tag: import('node-html-parser').HTMLElement) => number`

  A function that accepts each tag in head in turn and returns the order number of the tag. Tags with smaller order numbers will be sorted higher.

  By default, tags will be ordered in a way that best suits browser parallel loading.
