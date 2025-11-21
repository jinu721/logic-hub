export function rustWrapper(userCode: string, funcName: string) {
  const content = `
use std::io::{self, Read};
use serde_json::Value;

${userCode}

fn main() {
    let mut s = String::new();
    io::stdin().read_to_string(&mut s).unwrap();
    let v: Value = if s.trim().is_empty() { serde_json::json!({}) } else { serde_json::from_str(&s).unwrap() };
    let args = v.get("args").and_then(|a| a.as_array()).cloned().unwrap_or_default();
    let a = args.get(0).and_then(|x| x.as_f64()).unwrap_or(0.0);
    let b = args.get(1).and_then(|x| x.as_f64()).unwrap_or(0.0);
    let r = ${funcName}(a, b);
    println!(\"{\\\\\"result\\\\\":{} }\", r);
}
`.trim();
  return { name: "main.rs", content };
}
