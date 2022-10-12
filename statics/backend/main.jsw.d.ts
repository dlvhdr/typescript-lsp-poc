declare module "backend/main" {
  export * from "backend/main.jsw"
}
declare module "backend/main.jsw" {
  export const mutiply: (a: number, b: number) => Promise<any>
}