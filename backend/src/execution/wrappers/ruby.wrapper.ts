export function rubyWrapper(userCode: string, funcName: string) {
  const content = `
${userCode}

require 'json'
begin
  data = JSON.parse(STDIN.read || '{}')
  args = data['args'] || []
  res = method(:${funcName}).call(*args)
  puts({ result: res }.to_json)
rescue => e
  puts({ error: e.message }.to_json)
end
`.trim();
  return { name: "main.rb", content };
}