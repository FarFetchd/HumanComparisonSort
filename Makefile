.PHONY: clean

ranker: entry.cpp main.cpp sort.cpp tiny_sort.cpp entry.h sort.h tiny_sort.h algorithm_control.h
	g++ -o ranker entry.cpp main.cpp sort.cpp tiny_sort.cpp -std=c++11

clean:
	rm -f ranker
