import { run } from '../runner';
import { expect } from 'chai';
import 'mocha';

const importObject = {
  imports: {
    // we typically define print to mean logging to the console. To make testing
    // the compiler easier, we define print so it logs to a string object.
    //  We can then examine output to see what would have been printed in the
    //  console.
    print: (arg : any) => {
      importObject.output += arg;
      importObject.output += "\n";
      return arg;
    },
    abs: Math.abs,
    max: Math.max,
    min: Math.min,
    pow: Math.pow,
  },

  output: ""
};

// Clear the output before every test
beforeEach(function () {
  importObject.output = "";
});
  
// We write end-to-end tests here to make sure the compiler works as expected.
// You should write enough end-to-end tests until you are confident the compiler
// runs as expected. 
describe('run(source, config) function', () => {
  const config = { importObject };
  
  // We can test the behavior of the compiler in several ways:
  // 1- we can test the return value of a program
  // Note: since run is an async function, we use await to retrieve the 
  // asynchronous return value. 
  it('returns the right number', async () => {
    const result = await run("987", config);
    expect(result).to.equal(987);
  });

  // 2- we can test the behavior of the compiler by also looking at the log 
  // resulting from running the program
  it('prints something right', async() => {
    var result = await run("print(1337)", config);
    expect(config.importObject.output).to.equal("1337\n");
  });

  // 3- we can also combine both type of assertions, or feel free to use any 
  // other assertions provided by chai.
  it('prints two numbers but returns last one', async () => {
    var result = await run("print(987)", config);
    expect(result).to.equal(987);
    result = await run("print(123)", config);
    expect(result).to.equal(123);
    
    expect(config.importObject.output).to.equal("987\n123\n");
  });

  // Note: it is often helpful to write tests for a functionality before you
  // implement it. You will make this test pass!
  it('adds two numbers', async() => {
    const result = await run("2 + 3", config);
    expect(result).to.equal(5);
  });

  it('adds two numbers', async() => {
    const result = await run("2 + 3", config);
    expect(result).to.equal(5);
  });
  it("add three numbers", async() => {
    const result = await run("1+2+3",config);
    expect(result).to.equal(6);
  });
  
  it("subtracts two numbers", async() => {
    const result = await run("2-1",config);
    expect(result).to.equal(1);
  });

  it("add & multiply three numbers", async() => {
    const result = await run("2- 1*3",config);
    expect(result).to.equal(-1);
  });

  it("abs with computed result two numbers", async() => {
    const result = await run("abs(2- 4*5)",config);
    expect(result).to.equal(18);
  });

  it("print abs with computed result two numbers", async() => {
    const result = await run("print(abs(2- 4*5))",config);
    expect(result).to.equal(18);
    expect(config.importObject.output).to.equal("18\n");
  
  });

  it("pow two numbers", async() => {
    const result = await run("pow(7,2)",config);
    expect(result).to.equal(49);
  });

  it("max two numbers", async() => {
    const result = await run("max(4,2)",config);
    expect(result).to.equal(4);
  });

  it("min two numbers", async() => {
    const result = await run("min(3,9)",config);
    expect(result).to.equal(3);
  });

  it("print builtin 2 function",async() => {
    const result = await run("print(max(4,2))",config);
    expect(config.importObject.output).to.equal("4\n");
  });
  
  it("complex single operation", async() => {
    const result = await run("max(pow(2,4),max(4-3,200))",config);
    expect(result).to.equal(200);
  })

  // TODO: add additional tests here to ensure the compiler runs as expected
});