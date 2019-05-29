## MathTutor-js

Various js tools to help with converting MathTutor to HTML.


See [CTAT HTML Component Overview](https://github.com/CMUCTAT/CTAT/wiki/Component-Overview) for details about each type of component.


### Examples

#### Convert to HTML
`cd test && node parse_brd`

This will give you what the raw HTML looks like, in an unsorted array.




#### deprecated...
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



### Possible Next Steps
- Put the raw output HTML as part of the tutor.