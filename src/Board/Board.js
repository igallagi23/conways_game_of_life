import React, {useCallback, useEffect, useRef, useState} from 'react';
import produce from 'immer';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Button from "@material-ui/core/Button";
import StopIcon from '@material-ui/icons/Stop';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import ClearIcon from '@material-ui/icons/Clear';


const CELL_SIZE = 20;
const WIDTH = 800;
const HEIGHT = 800;

const rows = HEIGHT / CELL_SIZE;
const cols = WIDTH / CELL_SIZE;

const directions = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1]
];

const createDefaultBoard = () => {
    let board1 = [];
    for (let i = 0; i < rows; i++) {
        board1[i] = [];
        for (let j = 0; j < cols; j++)
            board1[i][j] = false;
    }
    return board1;
};

const createRandomBoard = () => {
    let board1 = [];
    for (let i = 0; i < rows; i++) {
        board1[i] = [];
        for (let j = 0; j < cols; j++)

            board1[i][j] = (Math.random() > 0.6 ? 1 : 0);
    }
    return board1;
};


export default function Board() {
    const [running, setRunning] = useState(false);
    const [gameBoard, setGameBoard] = useState(createDefaultBoard);

    const runningRef = useRef(running);
    runningRef.current = running;

    const runSimulation = (() => {
        console.log(runningRef.current);
        if(!runningRef) return;
        setGameBoard(oldBoard => {
            return produce(oldBoard, newBoard => {
                for (let i = 0; i < rows; i++) {
                    for (let j = 0; j < cols; j++) {
                        //TODO: first run acts weird
                        let neighbors = 0;
                        directions.forEach(([x, y]) => {
                            const newI = i + x;
                            const newK = j + y;
                            if (newI >= 0 && newI < rows && newK >= 0 && newK < cols) {
                                neighbors += oldBoard[newI][newK];
                            }
                        });

                        if (neighbors < 2 || neighbors > 3) {
                            newBoard[i][j] = 0;
                        } else if (oldBoard[i][j] === 0 && neighbors === 3) {
                            newBoard[i][j] = 1;
                        }
                    }
                }
                if(JSON.stringify(oldBoard) === JSON.stringify(newBoard)){
                    runningRef.current=false;
                    setRunning(false);
                    //TODO: add an end message;
                }
            });
        });

        if(runningRef.current)
            setTimeout(runSimulation, 100);
    });

    return (
        <div >
            {!running ? <><Button onClick={() => {
                setRunning(true);
                runningRef.current = true;
                runSimulation();
            }}><PlayArrowIcon></PlayArrowIcon>Start</Button>
                <Button onClick={()=>setGameBoard(createRandomBoard())}><AutorenewIcon></AutorenewIcon>Random</Button>
                <Button onClick={()=>setGameBoard(createDefaultBoard())}><ClearIcon></ClearIcon>Clear</Button>
            </>
                :
                <Button onClick={()=>{setRunning(false);runningRef.current = false;}}><StopIcon></StopIcon>Stop</Button>}



            <div style={{display: "grid",marginLeft:'20%', gridTemplateColumns: `repeat(${cols}, 20px)`}}>
                {gameBoard.map((row, i) =>
                    row.map((col, j) => (
                        <div key={`${i}-${j}`} onClick={() => {
                            const newBoard = produce(gameBoard, gridCopy => {
                                gridCopy[i][j] = gameBoard[i][j] ? 0 : 1;
                            });
                            setGameBoard(newBoard);
                        }}
                             style={{
                                 width: 20,
                                 height: 20,
                                 backgroundColor: gameBoard[i][j] ? 'blue' : 'white',
                                 border: "solid 1px black"
                             }}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

