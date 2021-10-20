import React, { useState, useEffect } from 'react';
import {  Text, View, Pressable } from 'react-native';
import Entypo from "@expo/vector-icons/Entypo"
import styles from '../style/style'

const START = 'plus';
const CROSS = 'cross';
const CIRCLE = 'circle';
const NBR_OF_ROWS = 5;
const NBR_OF_COLS = 5;
const NBR_OF_SHIPS = 3;
const NBR_OF_BOMBS = 15;
let initialBoard = new Array(NBR_OF_COLS * NBR_OF_ROWS).fill(START);

export default function Gameboard() {

const [bombsLeft, setBombsLeft] = useState(NBR_OF_BOMBS);
const [shipsLeft, setShipsLeft] = useState(NBR_OF_SHIPS);
const [hits, setHits] = useState(0);
const [ships, setShips] = useState([]);
const [startButton, setStartButton] = useState('Start Game');
const [status, setStatus] = useState("");
const [timeLeft, setTimeLeft] = useState(30);
const [gameStart, setGameStart] = useState(false);
const [board, setBoard] = useState(initialBoard);

   

    function winGame() {
        if (hits === 3 && timeLeft >= 0) {
          setGameStart(false);
          setStatus('You sinked all ships');
        }else
        if (hits < 3 && bombsLeft === 0 && timeLeft >= 0) {
          setGameStart(false);
          setStatus('Game Over. Ships remaining');
        }else
        if (timeLeft === 0 && hits < 3 && bombsLeft > 0) {
          setGameStart(false);
          setStatus('Timeout. Ships remaining');
        }else {
          return '';
        } 
      }

    useEffect(() => {
      winGame();
      if (gameStart === false && startButton === 'Start Game') {
        setStatus('Game has not started');
      }
      if (gameStart === true) {
        let interval = setInterval(() => {
          setTimeLeft(timeLeft => timeLeft -1);
        }, 1000)
        return () => clearInterval(interval)
      }
    }, [timeLeft,gameStart]);

    function drawItem(number) {
        if (gameStart === false && startButton === 'Start Game') {
          setStatus('Click the start button first...');
        } else
        if (ships[number] === 1 && gameStart === true && bombsLeft > 0 && board[number] === START) {
          board[number] = CIRCLE;
          setHits(hits+1);
          setShipsLeft(shipsLeft-1);
          setBombsLeft(bombsLeft-1);
        }else
        if (gameStart === true && bombsLeft > 0 && board[number] === START) {
          board[number] = CROSS;
          setBombsLeft(bombsLeft-1);
        }
      }    
    
    function randomShips() {
      for (let i= 0; i < 25; i++) {
          ships.push(0);
      }
      let i=0;
      while (i < 3) {
        let ship = Math.floor(Math.random() * (24 - 0 + 1)) + 0;
        if (ships[ship] === 0) {
          ships[ship] = 1;
          i++;
        }
      }
      setShips(ships);
    }


    function chooseItemColor(number) {
        if (board[number] === CROSS) {
            return "#FF3031"
        }
        else if (board[number] === CIRCLE) {
            return "#45CE30"
        }
        else {
            return "#74B9FF"
        }
    }

    function startGame() {
        if (startButton === 'New game') {
          let initialBoard = [...board];
          initialBoard = new Array(NBR_OF_COLS * NBR_OF_ROWS).fill(START);
          setBoard(initialBoard);
          setGameStart(false);
          setStartButton('Start Game');
          setTimeLeft(30);
          setBombsLeft(15);
          setHits(0);
          setShipsLeft(3);
          setShips([]);
        } else {
          setGameStart(true);
          setStartButton('New game');
          setStatus('Game is on...')
          randomShips();
        }
    }

    const items = [];
    for (let x = 0; x < NBR_OF_ROWS; x++) {
        const cols = [];
        for (let y = 0; y < NBR_OF_COLS; y++) {
        cols.push(
        <Pressable
        key={x * NBR_OF_COLS + y}
        style={styles.item}
        onPress={() => drawItem(x * NBR_OF_COLS + y)}>
            <Entypo
            key={x * NBR_OF_COLS + y}
            name={board[x * NBR_OF_COLS + y]}
            size={32}
            color={chooseItemColor(x * NBR_OF_COLS + y)} />    
        </Pressable>
    );
    }
        let row = 
        <View key={"row" + x}>
            {cols.map((item) => item)}
        </View>
        items.push(row);
    }

        
    return (
        <View style={styles.gameboard}>
            <View style={styles.flex}>{items}</View>
            <Pressable style={styles.button} onPress={()=>startGame(true)}>
                <Text style={styles.buttonText}>{startButton}</Text>
            </Pressable>
            <Text style={styles.gameinfo}>Hits: {hits}  Bombs: {bombsLeft}  Ships: {shipsLeft}</Text>
            <Text style={styles.gameinfo}>Time: {timeLeft} sec</Text>
            <Text style={styles.gameinfo}>Status: {status}</Text>
        </View>
    )
}
 