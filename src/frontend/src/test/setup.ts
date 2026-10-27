process.env.NODE_ENV = 'test'

import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/',
})

const globalScope = globalThis as unknown as Record<string, unknown>
globalScope.window = dom.window
globalScope.document = dom.window.document
globalScope.navigator = dom.window.navigator
globalScope.HTMLElement = dom.window.HTMLElement
globalScope.Node = dom.window.Node
globalScope.Event = dom.window.Event
globalScope.MouseEvent = dom.window.MouseEvent
globalScope.getComputedStyle = dom.window.getComputedStyle
globalScope.IS_REACT_ACT_ENVIRONMENT = true
