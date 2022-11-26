import "express-serve-static-core";
declare module "express-async-errors";

declare module "express" {
  export interface Request {
    roles?: string[];
    id?: string;
  }
}
