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

#ifndef __RANKING_INCLGUARD_TINYSORT_H_
#define __RANKING_INCLGUARD_TINYSORT_H_

#include <vector>
#include "entry.h"

//Sorts 5 or fewer items
std::vector<Entry*> tinySort(std::vector<Entry*> items);

#endif //__RANKING_INCLGUARD_TINYSORT_H_
