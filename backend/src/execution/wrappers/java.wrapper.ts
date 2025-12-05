export const javaWrapper = (userCode: string, funcName: string, testCases: any[]) => `
public class Main {

    // === USER CODE START ===
${userCode}
    // === USER CODE END ===

    public static void main(String[] args) {

        String[] inputs = new String[] {
            ${testCases.map((t) => `"${t.input[0]}"`).join(", ")}
        };

        for (String input : inputs) {
            try {
                String result = ${funcName}(input);
                System.out.println(result);
            } catch (Exception e) {
                System.out.println("error");
            }
        }
    }
}
`.trim();
