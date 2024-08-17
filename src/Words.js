import wordBank from "./wordle-bank.txt";
export const boardDefault = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
];

export const generateWordSet = async () => {
    //Using set instead of arrays for efficiency. This way it won't loop the whole array every time.
    let wordSet;
    let todaysWord;
    await fetch(wordBank)
        .then((response) => response.text())
        .then((result) => {
            const wordArr = result.split("\n");
            todaysWord = wordArr[Math.floor(Math.random() * wordArr.length)];
            wordSet = new Set(wordArr);
        });

    return { wordSet, todaysWord };
};
