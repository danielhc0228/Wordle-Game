import "./App.css";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import { boardDefault, generateWordSet } from "./Words";
import React, { useState, createContext, useEffect } from "react";
import GameOver from "./components/GameOver";

export const AppContext = createContext();

function App() {
    const [board, setBoard] = useState(boardDefault);
    const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letter: 0 });
    const [wordSet, setWordSet] = useState(new Set());
    const [correctWord, setCorrectWord] = useState("");
    const [disabledLetters, setDisabledLetters] = useState([]);
    const [gameOver, setGameOver] = useState({
        gameOver: false,
        guessedWord: false,
    });

    const resetGame = () => {
        setBoard([
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "", "", "", ""],
            ["", "", "", "", ""],
        ]);
        setCurrAttempt({ attempt: 0, letter: 0 });
        setGameOver({ gameOver: false, guessedWord: false });
        setDisabledLetters([]);
        generateWordSet().then((words) => {
            setWordSet(words.wordSet);
            setCorrectWord(words.todaysWord);
        });
        document.activeElement.blur();
    };

    useEffect(() => {
        generateWordSet().then((words) => {
            setWordSet(words.wordSet);
            setCorrectWord(words.todaysWord);
        });
    }, []);

    const onEnter = () => {
        if (currAttempt.letter !== 5) return;
        console.log(correctWord);

        let currWord = "";
        for (let i = 0; i < 5; i++) {
            currWord += board[currAttempt.attempt][i].toLowerCase();
        }
        if (!wordSet.has(currWord.toLowerCase())) {
            alert("Word not found");
        } else {
            setCurrAttempt({ attempt: currAttempt.attempt + 1, letter: 0 });

            if (currWord === correctWord) {
                setGameOver({ gameOver: true, guessedWord: true });
                return;
            }
            if (currAttempt.attempt === 5) {
                setGameOver({ gameOver: true, guessedWord: false });
                return;
            }
        }
    };

    const onDelete = () => {
        if (currAttempt.letter === 0) return;
        const newBoard = [...board];
        newBoard[currAttempt.attempt][currAttempt.letter - 1] = "";
        setBoard(newBoard);
        setCurrAttempt({ ...currAttempt, letter: currAttempt.letter - 1 });
    };

    const onSelectLetter = (key) => {
        if (currAttempt.letter > 4) return;
        const newBoard = [...board];
        newBoard[currAttempt.attempt][currAttempt.letter] = key;
        setBoard(newBoard);
        setCurrAttempt({
            attempt: currAttempt.attempt,
            letter: currAttempt.letter + 1,
        });
    };

    return (
        <div className='App'>
            <nav>
                <button id='retry-button' onClick={resetGame}>
                    Retry
                </button>
                <h1 id='title'>Wordle</h1>
            </nav>

            <AppContext.Provider
                value={{
                    board,
                    setBoard,
                    currAttempt,
                    setCurrAttempt,
                    correctWord,
                    onSelectLetter,
                    onDelete,
                    onEnter,
                    setDisabledLetters,
                    disabledLetters,
                    gameOver,
                }}
            >
                <div className='game'>
                    <Board />
                    {gameOver.gameOver ? <GameOver /> : <Keyboard />}
                </div>
            </AppContext.Provider>
        </div>
    );
}

export default App;
