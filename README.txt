1. different behaviours:
(1) In our compiler, the name of functions and variables can be same. However, it is not allowed in python. 
  I think the behaviour of python compiler is better because the code will be more readable.
  So I will check in the compiler.ts to see if the define statement has the same name as function. 
(2) Our compiler will not deal with overflow, if the result is larger than 32 bits, it will return 0. 
  There are two solutions here, one is to change the type into bigger one, another is to implement big number computation algorithm, which I think is better way.
(3) The print will return a number, which mean we can use print to assign an number to a variable, and in python print will return None.
  I think the solution here is to introduce a NoneType, and Nonetype cann't compare or compute with other number.

2. I think the most useful resource is TA's office hour, piazza of course and learn X in Y minutes.

3. In this assignment, I mostly refer to TA's video which I think is the most helpful resources I think. I also look on the piazza which inspires my testcase.