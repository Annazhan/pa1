import * as mocha from 'mocha';
import {expect} from 'chai';
import { parser } from 'lezer-python';
import { traverseExpr, traverseStmt, traverse, parse } from '../parser';
import { BinaryOp } from '../ast';

// We write tests for each function in parser.ts here. Each function gets its 
// own describe statement. Each it statement represents a single test. You
// should write enough unit tests for each function until you are confident
// the parser works as expected. 
describe('traverseExpr(c, s) function', () => {
  it('parses a number in the beginning', () => {
    const source = "987";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({tag: "num", value: 987});
  })

  it('parses a identifier in the beginning', () => {
    const source = "x";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({tag: "id", name: "x"});
  })

  it('parses a builtin1 in the beginning', () => {
    const source = "print(3)";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({tag: "builtin1", name: "print", arg:{
      tag: "num", value: 3
    }});
  })

  it('parses a builtin2 in the beginning', () => {
    const source = "max(2,3)";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({tag: "builtin2", name: "max",
      args: [
        {
          tag: "num",
          value: 2
        },
        {
          tag: "num",
          value: 3
        }
      ]
    });
  })

  it('parses a binary expression in the beginning', () => {
    const source = "2+3";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();
    // go to expression
    cursor.firstChild();

    const parsedExpr = traverseExpr(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({tag: "biryExpr", op: BinaryOp.Plus,
      left:{
        tag: "num",
        value: 2
      },
      right: {
        tag: "num",
        value: 3
      }
    });
  })
  
  // TODO: add additional tests here to ensure traverseExpr works as expected
});

describe('traverseStmt(c, s) function', () => {
  it('parses a statement in the beginning', () => {
    const source = "x=4";
    const cursor = parser.parse(source).cursor();

    // go to statement
    cursor.firstChild();

    const parsedExpr = traverseStmt(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal({tag: "define", name: "x", value:{
      tag: "num",
      value: 4
    }});
  })
  // TODO: add tests here to ensure traverseStmt works as expected
});

describe('traverse(c, s) function', () => {
  it('parses the whole code in the beginning', () => {
    const source = "x=4\nprint(x)";
    const cursor = parser.parse(source).cursor();

    const parsedExpr = traverse(cursor, source);

    // Note: we have to use deep equality when comparing objects
    expect(parsedExpr).to.deep.equal([{tag: "define", name: "x", value:{
      tag: "num",
      value: 4
    }},
    {
      tag: "expr", expr:{
        tag: "builtin1", name: "print", arg:{
          tag: "id",
          name: "x" 
        }
      }
    }]);
  })
  // TODO: add tests here to ensure traverse works as expected
});

describe('parse(source) function', () => {
  it('parse a number', () => {
    const parsed = parse("987");
    expect(parsed).to.deep.equal([{tag: "expr", expr: {tag: "num", value: 987}}]);
  });  

  it('parses the whole code', () => {
    const source = "x=-4\nprint(x)";
    const parsed = parse(source);

    // Note: we have to use deep equality when comparing objects
    expect(parsed).to.deep.equal([{tag: "define", name: "x", value:{
      tag: "num",
      value: -4
    }},
    {
      tag: "expr", expr:{
        tag: "builtin1", name: "print", arg:{
          tag: "id",
          name: "x" 
        }
      }
    }]);
  });
  // TODO: add additional tests here to ensure parse works as expected
});