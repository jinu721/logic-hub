export function pythonWrapper(userCode: string, funcName: string) {
  const content = `
${userCode}

import sys, json

def safe_call(fn, args):
    try:
        return {"actual": fn(*args)}
    except Exception as e:
        return {"error": str(e)}

try:
    raw = sys.stdin.read() or "{}"
    payload = json.loads(raw)

    fn = globals().get(payload.get("funcName"))
    if fn is None:
        print(json.dumps({"error": "Function not found"}))
        sys.exit(0)

    results = []
    for tc in payload.get("testcases", []):
        args = tc.get("input") if isinstance(tc.get("input"), list) else []
        r = safe_call(fn, args)
        results.append({
            "input": tc.get("input"),
            "expected": tc.get("expected"),
            "actual": r.get("actual"),
            "error": r.get("error")
        })

    print(json.dumps({"results": results}))
except Exception as e:
    print(json.dumps({"error": str(e)}))
`.trim();

  return { name: "main.py", content };
}
