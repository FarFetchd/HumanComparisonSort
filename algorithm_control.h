//Copyright 2015 Fred Douglas
//
//This file is part of HumanComparisonSort.
//
//HumanComparisonSort is free software; you can redistribute it and / or
//modify it under the terms of the GNU General Public License as published by
//the Free Software Foundation; either version 3 of the License, or
//(at your option) any later version.
//
//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//GNU General Public License for more details.
//
//The full text of the license can be found at:
//http://www.gnu.org/licenses/gpl.html


#ifndef __RANKING_INCLGUARD_ALGORITHM_CONTROL_H_
#define __RANKING_INCLGUARD_ALGORITHM_CONTROL_H_

//comment out to go back to ordinary merge!
#define _USE_HWANG_LIN_MERGE_

//memoization of Entry::operator<=. If commented, duplicate comparisons will 
//be presented to the user if the algorithm logic calls for it. (Hwang-Lin
//mergesort with <=5 items sorted directly does appear to do so sometimes).
#define _MEMOIZE_COMPARISONS_

//Use explicit sorting algorithm on arrays of <= this size
#define TINY_SORT_THRESHOLD 5

#endif //__RANKING_INCLGUARD_ALGORITHM_CONTROL_H_
