export function phpWrapper(userCode: string, funcName: string) {
  const content = `<?php
${userCode}

function safe_call($fnName, $args) {
    try {
        return ["actual" => $fnName(...$args)];
    } catch (Throwable $e) {
        return ["error" => $e->getMessage()];
    }
}

try {
    $raw = stream_get_contents(STDIN);
    $payload = $raw ? json_decode($raw, true) : [];

    $fnName = $payload["funcName"];
    if (!function_exists($fnName)) {
        echo json_encode(["error" => "Function not found"]);
        exit;
    }

    $results = [];
    foreach ($payload["testcases"] as $tc) {
        $args = is_array($tc["input"]) ? $tc["input"] : [];
        $res = safe_call($fnName, $args);
        $results[] = [
            "input" => $tc["input"],
            "expected" => $tc["expected"],
            "actual" => $res["actual"] ?? null,
            "error" => $res["error"] ?? null
        ];
    }

    echo json_encode(["results" => $results]);
} catch (Throwable $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
`.trim();

  return { name: "script.php", content };
}
