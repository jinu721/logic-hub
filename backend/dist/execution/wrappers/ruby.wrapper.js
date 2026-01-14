"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rubyWrapper = rubyWrapper;
function rubyWrapper(userCode, funcName) {
    const content = `
${userCode}

require "json"

def safe_call(fn, args)
  begin
    { actual: fn.call(*args) }
  rescue => e
    { error: e.message }
  end
end

begin
  raw = STDIN.read
  payload = raw.empty? ? {} : JSON.parse(raw)

  fn = method(payload["funcName"]) rescue nil
  if fn.nil?
    puts({ error: "Function not found" }.to_json)
    exit
  end

  results = []

  (payload["testcases"] || []).each do |tc|
    args = tc["input"].is_a?(Array) ? tc["input"] : []
    res = safe_call(fn, args)
    results << {
      input: tc["input"],
      expected: tc["expected"],
      actual: res[:actual],
      error: res[:error]
    }
  end

  puts({ results: results }.to_json)
rescue => e
  puts({ error: e.message }.to_json)
end
`.trim();
    return { name: "main.rb", content };
}
