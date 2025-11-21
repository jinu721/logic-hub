
export function dartWrapper(userCode: string, funcName: string) {
  const content = `
import 'dart:convert';
import 'dart:io';

${userCode}

void main() {
  var raw = stdin.readLineSync() ?? "";
  var data = raw.isEmpty ? {} : jsonDecode(raw);
  var args = (data['args'] ?? []);
  // support two numeric args
  var a = args.length>0 ? (args[0] as num).toDouble() : 0.0;
  var b = args.length>1 ? (args[1] as num).toDouble() : 0.0;
  var r = ${funcName}(a,b);
  print(jsonEncode({'result': r}));
}
`.trim();
  return { name: "main.dart", content };
}
