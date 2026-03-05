CXX ?= g++
CXXFLAGS ?= -std=c++20 -O2 -Wall -Wextra -pedantic -pthread

all: auraflow_bridge_cpp

auraflow_bridge_cpp: src/main.cpp
	$(CXX) $(CXXFLAGS) src/main.cpp -o auraflow_bridge_cpp

clean:
	rm -f auraflow_bridge_cpp
