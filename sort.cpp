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

#include <assert.h>
#include <vector>
#include <cmath> //just for the log2 in Hwang-Lin

#include "entry.h"
#include "sort.h"
#include "tiny_sort.h"

std::vector<Entry*> mergeSort(std::vector<Entry*> items)
{
	if(items.size() <= 5)
		return tinySort(items);
	
	int split_ind = items.size() / 2;
	
	std::vector<Entry*> left_half(items.begin(), items.begin() + split_ind);
	std::vector<Entry*> right_half(items.begin() + split_ind, items.end());
	
	std::vector<Entry*> left_sorted = mergeSort(left_half);
	std::vector<Entry*> right_sorted = mergeSort(right_half);
	
#ifdef _USE_HWANG_LIN_MERGE_
	return hwangLinMerge(left_sorted, right_sorted);
#else
	return basicMerge(left_sorted, right_sorted);
#endif
}


std::vector<Entry*> basicMerge(std::vector<Entry*> left_sorted, std::vector<Entry*> right_sorted)
{
	std::vector<Entry*> ret;
	int l=0;
	int r=0;
	
	while(l < left_sorted.size() && r < right_sorted.size())
	{
		if(*left_sorted[l] <= *right_sorted[r])
		{
			ret.push_back(left_sorted[l]);
			l++;
		}
		else
		{
			ret.push_back(right_sorted[r]);
			r++;
		}
	}
	while(l < left_sorted.size())
	{
		ret.push_back(left_sorted[l]);
		l++;
	}
	while(r < right_sorted.size())
	{
		ret.push_back(right_sorted[r]);
		r++;
	}
	return ret;
}


//[left_bound, right_bound]. That is, left_bound might be inserted AT (i.e. its current index, but not -1), 
//								and right_bound might be inserted AT (current index, not +1).
//Returns an index that can be used for vector.insert(), so that after the insertion 
//the vector will still be sorted.
int binaryInsert(std::vector<Entry*> const& items, Entry* inserting, int left_bound, int right_bound)
{
	if(items.size() == 0)
		return 0;
	
	if(right_bound == 0)
	{
		assert(left_bound == 0);
		return right_bound;
	}
	
	if(left_bound == items.size())
	{
		assert(right_bound == items.size());
		return right_bound;
	}
	
	if(left_bound == right_bound)
		return (*inserting) <= (*items[left_bound]) ? left_bound : left_bound + 1;
	
	if(left_bound + 1 == right_bound)
	{
		if((*inserting) <= (*items[left_bound]))
			return left_bound;
		else
		{
			if(right_bound == items.size() || (*inserting) <= (*items[right_bound]))
				return right_bound;
			else
				return right_bound + 1;
		}
	}
	
	int compare_ind = left_bound + ((right_bound - left_bound) - 1) / 2;
	if((*inserting) <= (*items[compare_ind]))
		return binaryInsert(items, inserting, left_bound, compare_ind);
	else
		return binaryInsert(items, inserting, compare_ind + 1, right_bound);
}


int i1to0(int idx) {return idx - 1;}
std::vector<Entry*> hwangLinMerge(std::vector<Entry*> _A_, std::vector<Entry*> _B_)
{
	//!!!'A' must always be the smaller array!!!
	std::vector<Entry*>& A = (_A_.size() <= _B_.size() ? _A_ : _B_);
	std::vector<Entry*>& B = (_A_.size() > _B_.size() ? _A_ : _B_);
	
	if(A.size() == 0)
		return B;
	if(B.size() == 0)
		return A;
	if(A.size() == 1)
	{
		int A_dest_ind = binaryInsert(B, A[0], 0, B.size());
		B.insert(B.begin() + A_dest_ind, A[0]);
		return B;
	}
	
	int larger_n = B.size();
	int smaller_m = A.size();
	
	int alpha = (int)log2((double)larger_n / (double)smaller_m);
	int x = larger_n - (1 << alpha) + 1;
	
	//INDEXING FROM ONE EVERYWHERE. In the non-pseudo-code, i1to0 handles it; i.e. the input to i1to0 is a 1-based index.
	if(*A[i1to0(smaller_m)] <= *B[i1to0(x)])
	{
		//This case is: return hwangLinMerge(A, B[1 until x]) ~ B[x through end]
		
		std::vector<Entry*> B_until_x(B.begin(), B.begin() + i1to0(x));
		std::vector<Entry*> B_x_to_end(B.begin() + i1to0(x), B.end());
		
		std::vector<Entry*> AB_merged = hwangLinMerge(A, B_until_x);
		AB_merged.insert(AB_merged.end(), B_x_to_end.begin(), B_x_to_end.end());
		return AB_merged;
	}
	else
	{
		//Binary insert A[m] into the part of B right of x. This takes care of A[m]: 
		//we know that {A[m]} ~ {B right of A[m]} goes at the end of the result.
		//So, if we let D = {B starting from A[m]'s new spot}, then we should recurse like:
		//return HLMerge(A with A[m] removed), B - D) ~ D
		
		int Am_dest_ind = binaryInsert(B, A[i1to0(smaller_m)], i1to0(x+1), B.size());
		B.insert(B.begin() + Am_dest_ind, A[i1to0(smaller_m)]);
		A.pop_back();
		
		std::vector<Entry*> D (B.begin() + Am_dest_ind, B.end());
		std::vector<Entry*> B_minus_D(B.begin(), B.begin() + Am_dest_ind);
		
		std::vector<Entry*> AB_merged = hwangLinMerge(A, B_minus_D);
		AB_merged.insert(AB_merged.end(), D.begin(), D.end());
		return AB_merged;
	}
}
