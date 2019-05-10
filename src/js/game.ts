import { Piece,
    Pawn,
    Rook,
    Bishop,
    Knight,
    King,
    Queen,
    Empty
} from "./piece.js"

const WIDTH = 8;
const HEIGHT = 8;

enum Side {
    BLACK,
    WHITE,
    EMPTY
}

const index = function(i: number, j: number): number {
    return i * WIDTH + j;
}

class Position {
    constructor(private x: number, private y: number) {
    }
    
    getx() {
        return this.x;
    }
    
    gety() {
        return this.y;
    }

    equals(other: Position) {
        return this.x == other.getx() && this.y == other.gety();
    }
}

class ChessState {
    board: Piece[];
    
    constructor() {
        this.board = new Array<Piece>(WIDTH * HEIGHT);
        for(let i = 0; i < HEIGHT; i++) {
            for(let j = 0; j < WIDTH; j++) {
                this.board[index(i, j)] = new Empty(new Position(j, i));
            }
        }
        
        for(let i = 0; i < WIDTH; i++){
            this.board[i + WIDTH*1] = new Pawn(new Position(i, 1), Side.WHITE);
            this.board[i + WIDTH*6] = new Pawn(new Position(i, 6), Side.BLACK);
        }

        this.board[0] = new Rook(new Position(0, 0), Side.WHITE);
        this.board[7] = new Rook(new Position(7, 0), Side.WHITE);
        this.board[7*WIDTH] = new Rook(new Position(0, 7), Side.BLACK);
        this.board[7 + 7*WIDTH] = new Rook(new Position(7, 7), Side.BLACK);

        this.board[1] = new Knight(new Position(1, 0), Side.WHITE);
        this.board[6] = new Knight(new Position(6, 0), Side.WHITE);
        this.board[1 + 7*WIDTH] = new Knight(new Position(1, 7), Side.BLACK);
        this.board[6 + 7*WIDTH] = new Knight(new Position(6, 7), Side.BLACK);

        this.board[2] = new Bishop(new Position(2, 0), Side.WHITE);
        this.board[5] = new Bishop(new Position(5, 0), Side.WHITE);
        this.board[2 + 7*WIDTH] = new Bishop(new Position(2, 7), Side.BLACK);
        this.board[5 + 7*WIDTH] = new Bishop(new Position(5, 7), Side.BLACK);

        this.board[3] = new Queen(new Position(3, 0), Side.WHITE);
        this.board[4] = new King(new Position(4, 0), Side.WHITE);
        
        this.board[3 + 7*WIDTH] = new Queen(new Position(3, 7), Side.BLACK);
        this.board[4 + 7*WIDTH] = new King(new Position(4, 7), Side.BLACK);
    }

    isVaild(pos: Position): boolean {
        return pos.getx() >= 0 && pos.getx() < WIDTH 
            && pos.gety() >= 0 && pos.gety() < HEIGHT
    }

    getPiece(pos: Position): Piece {
        var result = null;
        this.board.forEach(element => {
            if(pos.getx() == element.position.getx() &&
                pos.gety() == element.position.gety()) {
                result = element;
            }
        });

        return result;
    }

    getFurthestPath(self: Piece, pos1: Position, pos2: Position): Position[] {
        
        var result: Position[] = [];

        let definition = 10;
        let dx = (pos2.getx() - pos1.getx()) / definition;
        let dy = (pos2.gety() - pos1.gety()) / definition;

        for(let i = 1; i <= definition; i++) {
            let x = pos1.getx() + Math.floor(dx * i);
            let y = pos1.gety() + Math.floor(dy * i);
            let pos = new Position(x, y);
            let piece = this.getPiece(pos);
            
            if(piece == null) 
                return result;
            if(piece.getName() != 'empty')
                if(!piece.position.equals(self.position)) return result;

            let dup = false
            result.forEach((i) => {
                dup = dup || i.equals(pos);
            });
            if(!dup) result.push(pos);
        }

        return result;
    }

    getFurthestAttack(self: Piece, pos1: Position, pos2: Position): Position[] {
        
        var result: Position[] = []

        let definition = 10;
        let dx = (pos2.getx() - pos1.getx()) / definition;
        let dy = (pos2.gety() - pos1.gety()) / definition;
        
        for(let i = 1; i <= definition; i++) {
            let x = pos1.getx() + Math.floor(dx * i);
            let y = pos1.gety() + Math.floor(dy * i);
            let pos = new Position(x, y);
            let piece = this.getPiece(pos);
            console.log(pos);

            if(piece == null) 
                return result;
            if(piece.getName() != 'empty'){
                if(!piece.position.equals(self.position)) {
                    if(piece.getSide() != self.getSide()) result.push(pos);
                    return result; 
                }  
            }
            
            let dup = false
            result.forEach((i) => {
                dup = dup || i.equals(pos);
            });
            if(!dup) result.push(pos);
        }

        return result;
    }
}

export {
    ChessState,
    Position,
    WIDTH,
    Side,
    HEIGHT
}