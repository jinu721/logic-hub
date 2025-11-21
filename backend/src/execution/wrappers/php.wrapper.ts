export function phpWrapper(userCode: string, funcName: string) {
  const content = `<?php
${userCode}
try {
  $raw = trim(stream_get_contents(STDIN));
  $data = $raw ? json_decode($raw, true) : ['args'=>[]];
  $args = $data['args'] ?? [];
  $res = call_user_func_array('${funcName}', $args);
  echo json_encode(['result'=>$res]);
} catch (Exception $e) {
  echo json_encode(['error'=>$e->getMessage()]);
}
`.trim();
  return { name: "main.php", content };
}