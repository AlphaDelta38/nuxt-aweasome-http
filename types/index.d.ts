import type { TodoConvention } from './domain-types'

declare global {
  interface Convention extends TodoConvention {}
}
export {}
