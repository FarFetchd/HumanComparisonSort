Sorts items (lines in a text file, arbitrary files in a directory) based on
the human user's choices in pairwise comparisons. The algorithm used (merge
sort with the Hwang-Lin merge algorithm, 
http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.419.8292 ) comes 
close to the theoretical minimum number of comparisons.

The "rank files in a directory" mode requires xdg-open (Ubuntu has this 
installed by default) and Perl. The "rank lines in a text file" mode will 
run anywhere you can compile the code. For the text mode, after `make`-ing, run
`./ranker text sometextfile.txt`

This repository also includes a Javascript implementation of the algorithm. It's
working and tested (code snippet for testing included at bottom). It's written 
to fit with http://tohosort.comoj.com/, so it has some code from there. To use
on your own site, implement your own version of initItemsToSort() and
fnc_ShowData(item1, item2, sortingDone), and call fnc_Sort(-1 or 1)
when the user makes a choice. Note: the original Touhou ranker allows ties and
undoing; this version doesn't.
