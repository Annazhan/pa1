import { Stmt, Expr, BinaryOp } from "./ast";
import { parse } from "./parser";

// https://learnxinyminutes.com/docs/wasm/

type LocalEnv = Map<string, boolean>;

type CompileResult = {
  wasmSource: string,
};

var globalVars = new Set();

export function compile(source: string) : CompileResult {
  const ast = parse(source);
  
  const commandGroups = ast.map((stmt) => codeGen(stmt));
  const scratchVar : string = `(local $$last i32)`;
  const localDefines = [scratchVar];
  globalVars.forEach(v => {
    localDefines.push(`(local $${v} i32)`);
  })
  const commands = localDefines.concat([].concat.apply([], commandGroups));
  console.log("Generated: ", commands.join("\n"));
  return {
    wasmSource: commands.join("\n"),
  };
}

function codeGen(stmt: Stmt) : Array<string> {
  switch(stmt.tag) {
    case "define":
      var valStmts = codeGenExpr(stmt.value);
      globalVars.add(stmt.name);
      return valStmts.concat([`(local.set $${stmt.name})`]);
    case "expr":
      var exprStmts = codeGenExpr(stmt.expr);
      return exprStmts.concat([`(local.set $$last)`]);
  }
}

function codeGenExpr(expr : Expr) : Array<string> {
  switch(expr.tag) {
    case "builtin1":
      const argStmts = codeGenExpr(expr.arg);
      return argStmts.concat([`(call $${expr.name})`]);
    case "builtin2":
      const argExprs = expr.args.map((e) => codeGenExpr(e));
      return [].concat.apply([], argExprs).concat([`(call $${expr.name})`]);
    case "num":
      if ( expr.value <  -2147483648 || expr.value > 2147483647){
        throw new Error(`CompileError: ${expr.value} is overflow`)
      }
      return ["(i32.const " + expr.value + ")"];
    case "id":
      if (!globalVars.has(expr.name)){
        throw new Error(`ReferenceError: undefine variables ${expr.name}`);
      }
      return [`(local.get $${expr.name})`];
    case "biryExpr":
      const leftExpr = codeGenExpr(expr.left);
      const rightExpr = codeGenExpr(expr.right);
      const op = codeGenOp(expr.op);
      return [...leftExpr, ...rightExpr, op];

  }
}

function codeGenOp(op: BinaryOp): string{
  switch(op){
    case BinaryOp.Plus:
      return "(i32.add)";
    case BinaryOp.Minus:
      return "(i32.sub)";
    case BinaryOp.Mul:
      return "(i32.mul)";
    default:
      throw new Error("CompileError: unknown binary operator");
  }
    
}
