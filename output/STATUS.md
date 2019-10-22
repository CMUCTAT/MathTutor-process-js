
ALL:

- the expected input shows up outside the TextInput

<br>

PROCESS: 

	- open a BRD file from usual location
	- open the HTML interface from *MathTutor-js/output*

PROBLEMS:

	- 8.28
		- works for most, but not for *ans5*
	- 8.04
		- has a graph missing
	- 8.18
		- 01Runners.brd: why is *Q4C4* hidden?
		- 02Runners.brd: this works nicely for demo
	
	- 8.19
		- Mostly works, but has SAI with blank I
	
	- 6.22
    	- works, good for demo... but stops at *q7c1* and *q7c2*
	    - Interesting... the image location shows up as text in "ti"
    
 
 
 
 NEXT STEPS (doesn't need to look good, is ready now):
 
 	- copy package folders e.g. cp -R 6.03/ 6.03-HTML/
 	- remove Flash dubdir, and mkdir HTML
 	- mv interface_d.d.html
 	- put any images/css/etc under HTML/Assets
 	- svn add anything
 	- svn commit (w/ message)
 	
 
 	
