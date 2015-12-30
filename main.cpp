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

#include <vector>
#include <iostream>
#include <cstring>
#include <cstdlib>

#include "entry.h"
#include "sort.h"

using std::cout;
using std::cerr;
using std::endl;

void testNumComparisons(int input_set_size);
void realRun(EntryType input_mode, char* argv2);

int main(int argc, char** argv)
{
	if(argc != 3)
	{
		cerr << "usage: " << argv[0] << " <data | text> <data dir path (if data) | text file (if text)>\n" << endl;
		exit(1);
	}
	
	EntryType input_mode;
	if(std::strstr(argv[1], "text"))
		input_mode = TextFile;
	else if(std::strstr(argv[1], "test"))
		input_mode = Testing;
	else if(std::strstr(argv[1], "data"))
		input_mode = DataDir;
	else
	{
		cerr << "First argument must be either 'text' or 'data'\n" << endl;
		exit(1);
	}
	
	if(!std::strcmp(argv[1], "testmulti"))
		testNumComparisons(atoi(argv[2]));
	else
		realRun(input_mode, argv[2]);
}

void realRun(EntryType input_mode, char* argv2)
{
	std::vector<Entry*> items_to_sort;
	if(input_mode == DataDir)
		items_to_sort = processDataDir(argv2);
	else if(input_mode == Testing)
		items_to_sort = generateTestItems(atoi(argv2));
	else if(input_mode == TextFile)
		items_to_sort = processTextFile(argv2);
	
	std::vector<Entry*> sorted = mergeSort(items_to_sort);
	
	int total_comparisons = 0;
	for(int i=0; i<sorted.size(); i++)
	{
		sorted[i]->dump();
		total_comparisons += sorted[i]->my_comparisons;
	}
	total_comparisons /= 2;
	cout << total_comparisons << " total comparisons" << endl;
}

void testNumComparisons(int input_set_size)
{
	for(int test=0; test<30; test++)
	{
		std::vector<Entry*> sorted = mergeSort(generateTestItems(input_set_size));
		
		int total_comparisons = 0;
		for(int i=0; i<sorted.size(); i++)
			total_comparisons += sorted[i]->my_comparisons;
		
		total_comparisons /= 2;
		cout << total_comparisons << " total comparisons" << endl;
	}
}
