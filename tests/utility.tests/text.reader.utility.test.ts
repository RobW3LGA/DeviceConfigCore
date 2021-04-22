import { fileReaderMockArrange } from "../mocks";

import { textReader } from "../../src/utilities";


describe("text.reader utility tests", () => {

  test("textReader(fileReader: Function, filePath: string)() -> enter valid file path -> returns valid file content", async () => {

    const fileReader: Function = fileReaderMockArrange("Test file content", 1000);
    const filePath: string = "./test.file.txt";
    const sutFunction: Function = textReader(fileReader, filePath);

    const sut: string = await sutFunction();

    expect(sut).toContain("Content:\nTest file content");
  });


  test("textReader(fileReader: Function)(filePath: string) -> enter invalid file path -> throws 'no such file or directory' error", async () => {

    const fileReader: Function = fileReaderMockArrange("no such file or directory", 0, true);
    const filePath: string = "./test.file.txt";
    const sutFunction: Function = textReader(fileReader, filePath);

    try { await sutFunction() }
    catch (error) { expect(error).toBe("Thrown by test: no such file or directory") }
  });
});