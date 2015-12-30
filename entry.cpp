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

#include <iostream>
#include <cstdlib>
#include <cstring>
#include <fstream>
#include <assert.h>
#include <unistd.h>

using std::cout;
using std::cerr;
using std::endl;

#include "entry.h"

int g_num_entries_created = 0;

std::vector<Entry*> generateTestItems(int up_to)
{
	srand(rand());
	
	std::vector<Entry*> to_ret;
	for(int i=0; i<up_to; i++)
		to_ret.push_back(new Entry(i, Testing));
	
	//now shuffle!
	for(int i=0; i<to_ret.size(); i++)
	{
		int dest = i + rand() % (to_ret.size() - i);
		Entry* temp = to_ret[i];
		to_ret[i] = to_ret[dest];
		to_ret[dest] = temp;
	}
	
	return to_ret;
}

void Entry::dump() const
{
	if(my_type == Testing)
		cout << "VAL:" << value << ",COMPS=" << my_comparisons << endl;
	else if(my_type == DataDir)
		cout << my_target << endl;
	else if(my_type == TextFile)
		cout << my_text << endl;
	else
		cerr << "Unhandled enum type in Entry::dump()!" << endl;
}

void Entry::display() const
{
	if(my_type == Testing)
		cout << "VAL:" << value << ",COMPS=" << my_comparisons << ",  ";
	else if(my_type == DataDir)
		system( (my_command+" "+my_target).c_str() );
	else if(my_type == TextFile)
		cout << my_text;
	else
		cerr << "Unhandled enum type in Entry::display()!" << endl;
}


Entry::Entry(int val, EntryType the_type)
{
	my_type = the_type;
	my_comparisons = 0;
	orig_order_id = g_num_entries_created++; //not thread safe!
	
	value = val; 
}

Entry::Entry(std::string the_command, std::string the_target, EntryType the_type)
{
	my_type = the_type;
	my_comparisons = 0;
	orig_order_id = g_num_entries_created++; //not thread safe!
	
	my_command = the_command; 
	my_target = the_target;
}

Entry::Entry(std::string a_string, EntryType the_type)
{
	my_type = the_type;
	my_comparisons = 0;
	orig_order_id = g_num_entries_created++; //not thread safe!
	
	if(my_type == TextFile)
		my_text = a_string;
	else if(my_type == DataDir)
	{
		my_command = "xdg-open ";
		my_target = a_string;
	}
}

//Make each line in a text file into a separate TextEntry item, and return them all
std::vector<Entry*> processTextFile(std::string file_name)
{
	std::vector<Entry*> all_items;
	
	std::ifstream file_reader(file_name.c_str());
	std::string line_buf;
	while(std::getline(file_reader, line_buf))
		if(line_buf.length() > 0)
			all_items.push_back(new Entry(line_buf, TextFile));
	
	return all_items;
}

//Given a target data directory structure, asks a perl script to recursively collect all of the filepaths in it 
//and print them for us, separated by newlines. Make a CommandEntry out of each one, and return them all.
std::vector<Entry*> processDataDir(std::string dir_name)
{
	std::vector<Entry*> all_items;
	
	FILE* perl_pipe = popen((std::string("perl readdir.pl ")+dir_name).c_str(), "r");
	
	size_t line_getter_len = 500;
	char* line_getter = (char*)malloc(line_getter_len);
	memset(line_getter, 0, line_getter_len);
	while(getline(&line_getter, &line_getter_len, perl_pipe) > 0)
	{
		if(strchr(line_getter, '\n'))
			*strchr(line_getter, '\n') = 0;
		if(strlen(line_getter) > 0)
			all_items.push_back(new Entry(line_getter, DataDir));
	}
	pclose(perl_pipe);
	free(line_getter);
	
	return all_items;
}

bool Entry::operator<=(Entry& other) //non-const ref and non-const function so we can count comparisons
{
	if(my_type == Testing)
	{
		my_comparisons++;
		other.my_comparisons++;
		
		bool result = (value <= other.value);
		//cerr << "Comparing " << value << " and " << other.value << ", result will be " << (result ? "<" : ">") << endl;
		
		return result;
	}
	else if(my_type == DataDir)
	{
		unlink("compare_aaaaaaaaaaaaaaa");
		unlink("compare_bbbbbbbbbbbbbbb");
		symlink(my_target.c_str(), "compare_aaaaaaaaaaaaaaa");
		symlink(other.my_target.c_str(), "compare_bbbbbbbbbbbbbbb");
		
		system((my_command + "compare_aaaaaaaaaaaaaaa").c_str());
		system((other.my_command + "compare_bbbbbbbbbbbbbbb").c_str());
		
		DATAAGAINPLEASE:
		std::string reader;
		cout << "(a) " << my_text << endl << "(b) " << other.my_text << endl << "or (xa) or (xb) or (xab) to remove a, b, or both: " << std::flush;
		std::getline(std::cin, reader);
		
		bool ret;
		
		if(reader == "a")
			ret = true;
		else if(reader == "b")
			ret = false;
		else
		{
			cout << "a or b only for now, please!" << endl;
			goto DATAAGAINPLEASE;
		}
		system("killall gwenview");
		return ret;
	}
	else if(my_type == TextFile)
	{
		TEXTAGAINPLEASE:
		std::string reader;
		cout << "(a) " << my_text << endl << "(b) " << other.my_text << endl << "or (xa) or (xb) or (xab) to remove a, b, or both: " << std::flush;
		std::getline(std::cin, reader);
		if(reader == "a")
			return true;
		else if(reader == "b")
			return false;
		else
		{
			cout << "a or b only for now, please!" << endl;
			goto TEXTAGAINPLEASE;
		}
	}
	else
		cerr << "Unhandled enum type in Entry::operator<=()!" << endl;
	assert(false);
	return false;
}

bool Entry::operator<(Entry& other) //non-const ref and non-const function so we can count comparisons
{
	return ((*this) <= other); //Equality is not allowed, so they're the same.
}

bool Entry::operator>(Entry& other) //non-const ref and non-const function so we can count comparisons
{
	return !((*this) < other); //Equality is not allowed, so they're the same.
}
