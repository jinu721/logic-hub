export function javaWrapper(userCode: string, funcName: string) {
  const content = `
import java.util.*;
import java.io.*;

class Solution {
${userCode}
}

public class Main {
  public static void main(String[] args) {
    try {
      BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
      String json = br.readLine();
      if (json == null) json = "{}";

      // extract args array
      List<Double> nums = new ArrayList<>();
      int start = json.indexOf("[");
      int end = json.indexOf("]");
      if (start >= 0 && end > start) {
        String inner = json.substring(start+1, end);
        for (String t : inner.split(",")) {
          t = t.trim();
          if (!t.isEmpty()) nums.add(Double.parseDouble(t));
        }
      }

      Object res;

      switch (nums.size()) {
        case 0:
          res = Solution.class.getMethod("${funcName}").invoke(null);
          break;
        case 1:
          res = Solution.class.getMethod("${funcName}", double.class)
              .invoke(null, nums.get(0));
          break;
        case 2:
          res = Solution.class.getMethod("${funcName}", double.class, double.class)
              .invoke(null, nums.get(0), nums.get(1));
          break;
        case 3:
          res = Solution.class.getMethod("${funcName}", double.class, double.class, double.class)
              .invoke(null, nums.get(0), nums.get(1), nums.get(2));
          break;
        default:
          System.out.println("{\\"error\\":\\"Too many args\\"}");
          return;
      }

      System.out.println("{\\"result\\":" + res + "}");
    } catch (Exception e) {
      System.out.println("{\\"error\\":\\"" + e.getMessage() + "\\"}");
    }
  }
}
`.trim();
  return { name: "Main.java", content };
}
