declare module '*.css';

declare module 'react' {
  const React: any;
  export default React;
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export function jsxDEV(
    type: any,
    props: any,
    key?: any,
    isStaticChildren?: boolean,
    source?: any,
    self?: any,
  ): any;
}
