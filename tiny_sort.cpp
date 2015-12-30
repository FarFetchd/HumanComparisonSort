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

#include <array>
#include <assert.h>

#include "sort.h"
#include "tiny_sort.h"

std::vector<Entry*> sort4(Entry* A, Entry* B, Entry* C, Entry* D)
{
	if (*A > *B)
	{
		Entry* t = A;
		A = B;
		B = t;
	}		
	if (*C > *D)
	{
		Entry* t = C;
		C = D;
		D = t;
	}
	std::vector<Entry*> left; left.push_back(A); left.push_back(B);
	std::vector<Entry*> right; right.push_back(C); right.push_back(D);
	return basicMerge(left, right);
}

//thanks to Artelius (http://stackoverflow.com/questions/1534748/design-an-efficient-algorithm-to-sort-5-distinct-keys-in-fewer-than-8-comparison)
//for doing the tedious job of writing out the pseudocode!
std::array<Entry*, 5> sort5(Entry* A, Entry* B, Entry* C, Entry* D, Entry* E)
{
	if (*A > *B)
	{
		Entry* t = A;
		A = B;
		B = t;
	}		
	if (*C > *D)
	{
		Entry* t = C;
		C = D;
		D = t;
	}
	if (*A > *C)
	{
		Entry* t = A;
		A = C;
		C = t;
		
		t = B;
		B = D;
		D = t;
	}

	if (*E > *C)
	{
		if (*E > *D) //A C D E
		{
			if (*B > *D)
			{
				if (*B > *E)
					return std::array<Entry*, 5>{A, C, D, E, B};
				else
					return std::array<Entry*, 5>{A, C, D, B, E};
			}
			else	if (*B < *C)
				return std::array<Entry*, 5>{A, B, C, D, E};
			else
				return std::array<Entry*, 5>{A, C, B, D, E};
		}
		else if (*B > *E) //A C E D
		{
			if (*B > *D)
				return std::array<Entry*, 5>{A, C, E, D, B};
			else
				return std::array<Entry*, 5>{A, C, E, B, D};
		}
		else	if (*B < *C)
			return std::array<Entry*, 5>{A, B, C, E, D};
		else
			return std::array<Entry*, 5>{A, C, B, E, D};
	}
	else
	{
		if (*E < *A) //E A C D
		{
			if (*B > *C)
			{
				if (*B > *D)
					return std::array<Entry*, 5>{E, A, C, D, B};
				else
					return std::array<Entry*, 5>{E, A, C, B, D};
			}
			else
				return std::array<Entry*, 5>{E, A, B, C, D};
		}
		else if (*B > *C) //A E C D
		{
			if (*B > *D)
				return std::array<Entry*, 5>{A, E, C, D, B};
			else
				return std::array<Entry*, 5>{A, E, C, B, D};
		}
		else	if (*B < *E)
			return std::array<Entry*, 5>{A, B, E, C, D};
		else
			return std::array<Entry*, 5>{A, E, B, C, D};
	}
}

//Sorts 5 or fewer items
std::vector<Entry*> tinySort(std::vector<Entry*> items)
{
	std::vector<Entry*> ret;
	
	if(items.size() == 5)
	{
		std::array<Entry*, 5> as_array = sort5(items[0], items[1], items[2], items[3], items[4]);
		return std::vector<Entry*>(as_array.begin(), as_array.end());
	}
	else if(items.size() == 4)
		return sort4(items[0], items[1], items[2], items[3]);
	else if(items.size() == 3)
	{
		if(*items[1] <= *items[2])
		{
			if(*items[0] <= *items[1])
				return items;
			else
			{
				if(*items[0] <= *items[2])
					{ret.push_back(items[1]);ret.push_back(items[0]);ret.push_back(items[2]);}
				else
					{ret.push_back(items[1]);ret.push_back(items[2]);ret.push_back(items[0]);}
			}
		}
		else
		{
			if(*items[0] <= *items[2])
				{ret.push_back(items[0]);ret.push_back(items[2]);ret.push_back(items[1]);}
			else
			{
				if(*items[0] <= *items[1])
					{ret.push_back(items[2]);ret.push_back(items[0]);ret.push_back(items[1]);}
				else
					{ret.push_back(items[2]);ret.push_back(items[1]);ret.push_back(items[0]);}
			}
		}
		return ret;
	}
	else if(items.size() == 2)
	{
		if(*items[0] <= *items[1])
			return items;
		ret.push_back(items[1]); ret.push_back(items[0]);
		return ret;
	}
	else if(items.size() < 2)
		return items;
	
	assert(false);
}
