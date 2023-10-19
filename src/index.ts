import { sortBy } from 'lodash-es'
import type { HTMLElement, Node } from 'node-html-parser'
import { NodeType, parse } from 'node-html-parser'
import type { Plugin } from 'vite'

function isHTMLElement(node: Node): node is HTMLElement {
  return node.nodeType === NodeType.ELEMENT_NODE
}

function groupNodes(nodes: Node[]) {
  let groups: Node[][] = []
  let currentGroup: Node[] = []
  for (const node of nodes) {
    currentGroup.push(node)
    if (isHTMLElement(node)) {
      groups.push(currentGroup)
      currentGroup = []
    }
  }
  if (currentGroup.length) {
    groups.push(currentGroup)
  }
  return groups
}

function replaceChildNodes(parent: HTMLElement, childNodes: Node[]) {
  parent.innerHTML = ''
  for (const node of childNodes) {
    parent.appendChild(node)
  }
}

const defaultOrder = (node: HTMLElement) => {
  if (node.tagName === 'META' || node.tagName === 'TITLE') return 1
  if (node.tagName === 'LINK') {
    switch (node.getAttribute('rel')) {
      case 'dns-prefetch':
      case 'preconnect':
        return 2.1
      case 'modulepreload':
      case 'preload':
        return 2.2
      case 'prefetch':
      case 'prerender':
        return 2.3
      case 'stylesheet':
        return 2.4
      // Icons and links
      default:
        return 1
    }
  }
  return 3
}

const htmlSortTags = ({ order = defaultOrder } = {}): Plugin => {
  return {
    name: 'vite-plugin-html-sort-tags',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      const root = parse(html)
      const head = root.querySelector('head')
      if (head) {
        replaceChildNodes(head, sortBy(groupNodes(head.childNodes), group => {
          return order(group[group.length - 1] as HTMLElement)
        }).flat())
      }
      return root.toString()
    },
  }
}

export default htmlSortTags
