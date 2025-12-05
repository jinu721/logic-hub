export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (a == null || b == null) return a === b;

  const aNum = Number(a);
  const bNum = Number(b);
  const bothNumbers = !Number.isNaN(aNum) && !Number.isNaN(bNum) && (typeof a === "number" || typeof b === "number" || (typeof a === "string" && typeof b === "string"));
  if (bothNumbers) {
    return Math.abs(aNum - bNum) < 1e-9;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    if (aKeys.length !== bKeys.length) return false;
    for (let i = 0; i < aKeys.length; i++) {
      if (aKeys[i] !== bKeys[i]) return false;
      if (!deepEqual(a[aKeys[i]], b[bKeys[i]])) return false;
    }
    return true;
  }

  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

function isPlainObject(x: any): x is Record<string, any> {
  return Object.prototype.toString.call(x) === "[object Object]";
}
