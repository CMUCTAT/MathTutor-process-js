## MathTutor-js

Various js tools to help with converting MathTutor to HTML.


*index.js*

Run `node index.js` to get the starting view of a tutor.


### Examples

`node index -g /Users/kevindeland/git/svn/Mathtutor/6thGrade/6.01/MassProduction/Unit1.brd -t /Users/kevindeland/git/svn/Mathtutor/6thGrade/6.01/MassProduction/Unit1.txt -p Problem1 | grep warn`

will output

- warn: In the last Olympic Games, the... --> %(problem)%
- warn: The number of silver medals re... --> %(givenname)%
- warn: The number of gold medals rece... --> %(solvename)%
- warn: silver medals --> %(given)%
- warn: gold medals --> %(solve)%
- warn: Expression --> %(three)%
- warn: FALSE --> %(visRow4)%
- warn: FALSE --> %(visRow4)%
- warn: FALSE --> %(visRow4)%
- warn: FALSE --> %(visRow4)%

You can then compare this input to a Flash interface that is connected to the BRD graph specified by -g.