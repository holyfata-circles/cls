/**
 * Utility for joining classNames, supporting string, number, boolean, object, array, etc.
 */
type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, unknown>
  | ClassValue[];

/**
 * Join classNames
 * @param args Multiple className arguments
 * @returns The joined className string
 */
export function cls(...args: ClassValue[]): string {
  return args
    .flatMap((arg) => parseValue(arg))
    .filter(Boolean)
    .join(" ");
}

/**
 * Parse a single argument into an array of className strings
 */
function parseValue(arg: ClassValue): string[] {
  if (!arg || typeof arg === "boolean") return [];
  if (typeof arg === "string" || typeof arg === "number") return [String(arg)];
  if (Array.isArray(arg)) return arg.flatMap(parseValue);

  // Custom toString (including inherited)
  if (
    typeof arg === "object" &&
    typeof arg.toString === "function" &&
    arg.toString !== Object.prototype.toString &&
    !/\[native code\]/.test(String(arg.toString))
  ) {
    return [arg.toString()];
  }

  // Plain object: key as className, value as truthy/falsy
  return Object.keys(arg as Record<string, unknown>)
    .filter((key) => Boolean((arg as Record<string, unknown>)[key]))
    .map((key) => key);
}
