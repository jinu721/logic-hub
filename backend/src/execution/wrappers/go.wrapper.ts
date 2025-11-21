export function goWrapper(userCode: string, funcName: string) {
  const content = `
package main
import (
  "encoding/json"
  "fmt"
  "os"
)

${userCode}

func main() {
  decoder := json.NewDecoder(os.Stdin)
  var data map[string]interface{}
  _ = decoder.Decode(&data)
  argsRaw, _ := data["args"].([]interface{})
  // support two-arg numeric function
  if len(argsRaw) >= 2 {
    a := argsRaw[0].(float64)
    b := argsRaw[1].(float64)
    res := ${funcName}(a, b)
    out, _ := json.Marshal(map[string]interface{}{"result": res})
    fmt.Println(string(out))
    return
  }
  fmt.Println(` + "`{\"error\":\"invalid args\"}`" + `)
}
`.trim();
  return { name: "main.go", content };
}