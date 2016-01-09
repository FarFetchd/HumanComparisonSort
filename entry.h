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


#ifndef __RANKING_INCLGUARD_ENTRY_H_
#define __RANKING_INCLGUARD_ENTRY_H_

#include <string>
#include <vector>
#include <unordered_map>

#include "algorithm_control.h"

extern int g_num_entries_created;

//disgusting hack to get allllllll the polymorphism
enum EntryType {TextFile, DataDir, Testing};

class Entry
{
	
private:
	int orig_order_id;
	EntryType my_type; //hooray for hacky polymorphism.... :-/
	
	std::unordered_map<int, Entry*> better_than_me;
	std::unordered_map<int, Entry*> worse_than_me;
	
	//the overloaded operators are memoized wrappers of this
	bool actualCompareLT(Entry& other);
	
	void addMeToAllWorse(std::vector<Entry*> superior_ones);
	
public:
	int getUniqueID() const { return orig_order_id; }
	
	int my_comparisons;
	
	//Testing:
	int value;
	Entry(int val, EntryType the_type); 
	
	//Text:
	std::string my_text;
	Entry(std::string a_string, EntryType the_type); //for Text or Data
	
	//Data:
	std::string my_target;
	std::string my_command;
	Entry(std::string the_command, std::string the_target, EntryType the_type);
	
	//I want to force subclasses to implement this, but if the argument is Entry&, they can't...
	//TODO Oh wait, we can get around it! Have operator<= defined in the base Entry class, and 
	//then have display() be the abstract method they're forced to implement.
	//virtual bool operator<=(Entry& other) = 0; 
	
	//Here is where I learned that overloaded binary operators prevent polymorphism...
	bool operator<=(Entry& other); //non-const ref and non-const function so we can count comparisons
	bool operator<(Entry& other);
	bool operator>(Entry& other);
	
	void display() const;//display for comparison; e.g. show an image
	void dump() const;   //dump for debugging or gathering results; e.g. print the image's filepath
};

std::vector<Entry*> generateTestItems(int up_to);

//Make each line in a text file into a separate TextEntry item, and return them all
std::vector<Entry*> processTextFile(std::string file_name);

//Given a target data directory structure, asks a perl script to recursively collect all of the filepaths in it 
//and print them for us, separated by newlines. Make a CommandEntry out of each one, and return them all.
std::vector<Entry*> processDataDir(std::string dir_name);

#endif //__RANKING_INCLGUARD_ENTRY_H_
