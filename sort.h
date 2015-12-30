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

#ifndef __RANKING_INCLGUARD_SORT_H_
#define __RANKING_INCLGUARD_SORT_H_

#include <vector>

#include "entry.h"

std::vector<Entry*> mergeSort(std::vector<Entry*> items);

std::vector<Entry*> hwangLinMerge(std::vector<Entry*> A, std::vector<Entry*> B);
std::vector<Entry*> basicMerge(std::vector<Entry*> left_sorted, std::vector<Entry*> right_sorted);

//comment out to go back to ordinary merge!
#define _USE_HWANG_LIN_MERGE_

#endif //__RANKING_INCLGUARD_SORTS_H_
