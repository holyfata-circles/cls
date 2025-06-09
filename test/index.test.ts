import { describe, it } from "bun:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { cls } from "../src";

describe("cls", () => {
  it("keeps keys with truthy values in objects", () => {
    assert.equal(
      cls({
        a: true,
        b: false,
        c: 0,
        d: null,
        e: undefined,
        f: 1,
      }),
      "a f",
    );
  });

  it("mixes arrays and arguments, ignores falsy values", () => {
    assert.equal(cls("a", 0, null, undefined, false, "b"), "a b");
    assert.equal(cls({ a: true }, "b", 0), "a b");
    assert.equal(cls("", "b", {}, ""), "b");
    assert.equal(cls({}), "");
  });

  it("supports array arguments", () => {
    assert.equal(cls(["a", "b"]), "a b");
    assert.equal(cls(["a", "b"], "c"), "a b c");
    assert.equal(cls("c", ["a", "b"]), "c a b");
    assert.equal(cls(["a", "b"], ["c", "d"]), "a b c d");
    assert.equal(cls(["a", 0, null, undefined, false, true, "b"]), "a b");
    assert.equal(cls(["a", ["b", "c"]]), "a b c");
    assert.equal(cls(["a", { b: true, c: false }]), "a b");
    assert.equal(cls(["a", ["b", ["c", { d: true }]]]), "a b c d");
    assert.equal(cls("a", []), "a");
    assert.equal(cls("a", [[]]), "a");
  });

  it("handles various truthy and falsy properties", () => {
    assert.equal(
      cls({
        // falsy:
        null: null,
        emptyString: "",
        noNumber: Number.NaN,
        zero: 0,
        negativeZero: -0,
        false: false,
        undefined: undefined,
        // truthy:
        nonEmptyString: "foobar",
        whitespace: " ",
        function: Object.prototype.toString,
        emptyObject: {},
        nonEmptyObject: { a: 1, b: 2 },
        emptyList: [],
        nonEmptyList: [1, 2, 3],
        greaterZero: 1,
      }),
      "nonEmptyString whitespace function emptyObject nonEmptyObject emptyList nonEmptyList greaterZero",
    );
  });

  it("supports objects with custom toString method", () => {
    assert.equal(
      cls({
        toString: () => "classFromMethod",
      }),
      "classFromMethod",
    );
  });

  it("supports inherited toString method", () => {
    class Class1 {
      toString() {
        return "classFromMethod";
      }
    }
    class Class2 extends Class1 {}
    // @ts-ignore
    assert.equal(cls(new Class2()), "classFromMethod");
  });

  it("supports objects in VM context", () => {
    const context = { cls, output: undefined };
    vm.createContext(context);

    const code = "output = cls({ a: true, b: true });";

    vm.runInContext(code, context);
    assert.equal(context.output, "a b");
  });
});
