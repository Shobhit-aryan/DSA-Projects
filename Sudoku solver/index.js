
var arr = [[], [], [], [], [], [], [], [], []]
var temp = [[], [], [], [], [], [], [], [], []]
var board = [[], [], [], [], [], [], [], [], []]

for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(i * 9 + j);
    }
}

function initializeTemp(temp) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            temp[i][j] = false;
        }
    }
}

function setTemp(board, temp) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0)
                temp[i][j] = false;
        }
    }
}
function setColor(temp) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (temp[i][j] == true) {
                arr[i][j].style.color = "#DC3545";
            }
        }
    }
}
function resetColor() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            arr[i][j].style.color = "green";
        }
    }
}

let button = document.getElementById('generateSudoku')
let solve = document.getElementById('solveSudoku')

console.log(arr)

function changeBoard(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) 
                arr[i][j].innerText = board[i][j];
            else
                arr[i][j].innerText = '';
        }
    }
}

button.onclick = function(){
    var xhr = new XMLHttpRequest()
   
    xhr.onload = function(){
        var response =JSON.parse(xhr.response);
        //console.log(response);
        initializeTemp(temp);
        resetColor();
        board = response.board;
        setTemp(board,temp);
        setColor(temp);
        changeBoard(board);
    }
    xhr.open('get','https://sugoku.herokuapp.com/board?difficulty=easy');
   /*var level = document.getElementById('difficult')
    if(level=='easy')
        xhr.open('get','https://sugoku.herokuapp.com/board?difficulty=easy');
    else if(level=='medium')
    xhr.open('get','https://sugoku.herokuapp.com/board?difficulty=medium');
    else if(level=='hard')
    xhr.open('get','https://sugoku.herokuapp.com/board?difficulty=hard');
*/
    xhr.send();
    
}


function solveSudokuHelper(board, row, col) {
    if (row == 9) //final condition
    {
        changeBoard(board);
        return;
    }
    if (col == 9) //row completed condition
    {
        solveSudokuHelper(board, row + 1, 0); //go to next row
        return;
    }
    if (board[row][col] != 0) {
        solveSudokuHelper(board, row, col + 1); //if not empty cell move to next
    }

    for (var i = 1; i <= 9; i++)  // i is the possible value to be inserted in cell
    {
        if (isValid(board, row, col, i)) {
            board[row][col] = i;
            solveSudokuHelper(board, row, col + 1);
            board[row][col] = 0;
        }
    }
}

function isValid(board, row, col, val) {
    // traverse that column and row to check if val is repeated or not
    for (var i = 0; i < 9; i++) {
        if (board[i][col] == val || board[row][i] == val) {
            return false;
        }
    }
    // traverse that row to check if val is repeated or not

    /* for(var i=0;i<9;i++)
     {
         if(board[row][i] == val)
         {
             return false;
         }
     }
     */

    // traverse that block to check if val is repeated or not

    var r = row - row % 3;
    var c = col - col % 3;
    for (var i = r; i < r + 3; i++) {
        for (var j = c; j < c + 3; j++) {
            if (board[i][j] == val)
                return false;
        }
    }
    return true;

}

function solveSudoku(board) {
    solveSudokuHelper(board, 0, 0)
}

solve.onclick = function () {
    solveSudoku(board)
}