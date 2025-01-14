import {parser} from "lezer-python";
import {TreeCursor} from "lezer-tree";
import {BinaryOp, Expr, Stmt} from "./ast";

export function traverseArglist(c: TreeCursor, s:string): Array<Expr>{
  c.firstChild(); // go into arglist
  const argList = [];
  while (c.nextSibling()){
    argList.push(traverseExpr(c, s));
    c.nextSibling();
  }
  c.parent(); // pop arglist
  return argList;
}

export function traverseExpr(c : TreeCursor, s : string) : Expr {
  switch(c.type.name) {
    case "Number":
      const val = parseInt(s.substring(c.from, c.to));
      return {
        tag: "num",
        value: val
      };
    case "VariableName":
      return {
        tag: "id",
        name: s.substring(c.from, c.to)
      };
    case "CallExpression":
      c.firstChild();
      const callName = s.substring(c.from, c.to);
      c.nextSibling(); // go to arglist
      const argList = traverseArglist(c, s);
      c.parent(); // pop CallExpression
      if (argList.length == 1){
        if (callName != "print" && callName != "abs"){
          throw new Error("ParseError: unknown buildin1");
        }
        return {
          tag: "builtin1",
          name: callName,
          arg: argList[0]
        }
      } 
      else if (argList.length == 2){
        if (callName != "max" && callName != "min" && callName != "pow"){
          throw new Error("ParseError: unknown buildin2");
        }
        return {
          tag: "builtin2",
          name: callName,
          args: argList
        }
      }
      else{
        throw new Error("ParseError: unknown call function");
      }
      case "UnaryExpression":
        c.firstChild();
        const UnaryOp  = s.substring(c.from, c.to);
        // console.log(s.substring(c.from, c.to));
        if (UnaryOp != "-" && UnaryOp != "+"){
          throw new Error("ParseError: not a number");
        }
        c.nextSibling()
        const value = Number("-"+s.substring(c.from, c.to));
        if(isNaN(value)){
          throw new Error("ParseError: not a number");
        }
        c.parent();
        return {
          tag: "num",
          value: value
        };
      case "BinaryExpression":
        c.firstChild();
        const left = traverseExpr(c, s);
        c.nextSibling();
        var op : BinaryOp;
        switch(s.substring(c.from, c.to)){ //+-*
          case "+":
            op = BinaryOp.Plus;
            break;
          case "-":
            op = BinaryOp.Minus;
            break;
          case '*':
            op = BinaryOp.Mul;
            break;
          default:
            throw new Error("ParseError: unknown binary operator");
        }
        c.nextSibling();
        const right = traverseExpr(c,s)
        c.parent();
        return {tag: "biryExpr", op:op, left:left, right: right}

    default:
      throw new Error("ParseError: Could not parse expr at " + c.from + " " + c.to + ": " + s.substring(c.from, c.to));
  }
}

export function traverseStmt(c : TreeCursor, s : string) : Stmt {
  switch(c.node.type.name) {
    case "AssignStatement":
      c.firstChild(); // go to name
      const name = s.substring(c.from, c.to);
      c.nextSibling(); // go to equals
      c.nextSibling(); // go to value
      const value = traverseExpr(c, s);
      c.parent();
      return {
        tag: "define",
        name: name,
        value: value
      }
    case "ExpressionStatement":
      c.firstChild();
      const expr = traverseExpr(c, s);
      c.parent(); // pop going into stmt
      return { tag: "expr", expr: expr }
    default:
      throw new Error("ParseError: Could not parse stmt at " + c.node.from + " " + c.node.to + ": " + s.substring(c.from, c.to));
  }
}

export function traverse(c : TreeCursor, s : string) : Array<Stmt> {
  switch(c.node.type.name) {
    case "Script":
      const stmts = [];
      c.firstChild();
      do {
        stmts.push(traverseStmt(c, s));
      } while(c.nextSibling())
      console.log("traversed " + stmts.length + " statements ", stmts, "stopped at " , c.node);
      return stmts;
    default:
      throw new Error("ParseError: Could not parse program at " + c.node.from + " " + c.node.to);
  }
}
export function parse(source : string) : Array<Stmt> {
  const t = parser.parse(source);
  return traverse(t.cursor(), source);
}
