## MathTutor-js

Various js tools to help with converting MathTutor to HTML.


See [CTAT HTML Component Overview](https://github.com/CMUCTAT/CTAT/wiki/Component-Overview) for details about each type of component.


### Examples

#### Iterate through alllll the BRD files.
`cd test && node parse_all_brds`

This will output all the CTATComponent HTML \<div\>s for each Tutor.

`cd test && node parse_all_brds | grep UNKNOWN` will show you all the CTATComponents that are still unknown.
Open *brd.js* and find the *getCtatClass()* function to see how XML elements are mapped to HTML components.

`cd test && node parse_all_brds | grep SOME_` will show you CTATComponents that have a component which has not been identified as an offical CTAT Component.


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