export function csharpWrapper(userCode: string, funcName: string) {
  const content = `
using System;
using System.Text.Json;
public class Solution {
${userCode}
}
public class Program {
  public static void Main() {
    var json = Console.In.ReadToEnd();
    var doc = JsonDocument.Parse(string.IsNullOrWhiteSpace(json)? "{}" : json);
    var args = doc.RootElement.GetProperty("args").EnumerateArray();
    double a = args.MoveNext() ? args.Current.GetDouble() : 0;
    args.MoveNext();
    double b = args.Current.GetDouble();
    var res = Solution.${funcName}(a,b);
    Console.WriteLine(JsonSerializer.Serialize(new { result = res }));
  }
}
`.trim();
  return { name: "Program.cs", content };
}