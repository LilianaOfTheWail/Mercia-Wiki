declare module '*.css'

declare module 'react' {
  const React: any
  export default React
  export const createElement: any
  export const Fragment: any
  export const useState: any
  export const useEffect: any
  export const useMemo: any
  export const useCallback: any
  export const useRef: any
  export type ReactNode = any
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any
  export function jsxs(type: any, props: any, key?: any): any
  export function jsxDEV(type: any, props: any, key?: any, isStaticChildren?: boolean, source?: any, self?: any): any
}
