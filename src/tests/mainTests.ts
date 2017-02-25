import * as assert from "assert";
import * as path from "path";
import * as fs from "fs";
import {runNameofOnFiles} from "./runNameofOnFiles";

describe("main tests", () => {
    function runTest(fileName: string, expectedContents: string) {
        const filePath = path.join(__dirname, "testFiles", fileName);
        const results = runNameofOnFiles([filePath]);

        it("should replace", () => {
            assert.equal(results[0].text.replace(/\r?\n/g, "\n"), expectedContents.replace(/\r?\n/g, "\n"));
        });
    }

    describe("general file", () => {
        it("should have the correct number of characters", () => {
            // because an IDE might auto-format the code, this makes sure that hasn't happened
            assert.equal(fs.readFileSync(path.join(__dirname, "../../src/tests/testFiles/GeneralTestFile.ts"), "utf-8").replace(/\r?\n/g, "\n").length, 223);
        });

        const expected =
`console.log("alert");
console.log("alert");
console.log("alert");
console.log("window");
console.log("window");
console.log("nameof(nameof(clearTimeout))");
`;

        runTest("GeneralTestFile.ts", expected);
    });

    describe("single statement test file", () => {
        const expected =
`"window";
`;
        runTest("SingleStatementTestFile.ts", expected);
    });

    describe("comments test file", () => {
        const expected =
`"window";
// nameof(window);
"window";
/* nameof(window);
nameof(window);
*/
"window";
`;
        runTest("CommentsTestFile.ts", expected);
    });

    describe("strings test file", () => {
        const expected =
`"window";
\`nameof(window);
$\{"window"\}
$\{"alert"\}
nameof(window);
\`;
"nameof(window);";
"\\"nameof(window);";
'nameof(window);';
'\\'\\"nameof(window);';
"window";
`;
        runTest("StringsTestFile.ts", expected);
    });
});
