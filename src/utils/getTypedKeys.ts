export function getTypedKeys <T extends {}> (object: T): (keyof T)[] {
  return Object.keys(object) as (keyof T)[]
}
