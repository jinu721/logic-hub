export function pythonWrapper(userCode: string, funcName: string) {
  const content = `
${userCode}

import sys, json
try:
    raw = sys.stdin.read()
    data = json.loads(raw) if raw else {"args":[]}
    args = data.get("args", [])
    fn = globals().get("${funcName}")
    if fn is None:
        raise Exception("Function ${funcName} not found")
    result = fn(*args)
    print(json.dumps({"result": result}))
except Exception as e:
    print(json.dumps({"error": str(e)}))
`.trim();
  return { name: "main.py", content };
}