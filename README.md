# PromiseKeeper

## Installing the project
The instructions are for installation on Ubuntu.

### Prerequisites
1) Install Node and npm<br />

```
  $ sudo apt-get update
  $ sudo apt-get install nodejs
  $ sudo apt-get install npm
```

2) Install Git:
```
$ sudo apt install git-all
```

3) Install pip
```
$ sudo apt install python-pip
```

4) Install Graphviz<br />
- We are using the [node-graphviz](https://github.com/glejeune/node-graphviz) package, which is based on [Graphviz](http://www.graphviz.org). You need to install both:

```
  $ npm install graphviz
```

- [Download](http://www.graphviz.org/Download.php) and install Graphviz
- If location of Graphviz is not on your path, you need to set it in src/graph/vis/graphVis.js:  E.g., vGraph.setGraphVizPath("/usr/local/bin");
    
5) Clone PromiseKeeper<br />

```
 $ git clone https://github.com/franktip/PromiseKeeper.git
```

6) Download and install [Jalangi](https://github.com/Samsung/jalangi2)

```
$git clone https://github.com/Samsung/jalangi2

$sudo apt-get update
$sudo apt-get install python-software-properties python g++ make
$sudo apt-get install chromium-browser
```

7) Set the following environment variable to locations of PromiseKeeper and Jalangi, respectively
```
$PROMISES_HOME
$JALANGI_HOME
```

## Running the unit tests
You can run the Mocha unit tests from the command line. First, switch to the project directory (PromiseKeeper). Then, execute the following command:
```
  $npm test
```

You can also run the unit tests within an IDE that is bundled with Node and Mocha plugins, by running the test/unit-tests.js as a Mocha test file.

Expected output:

- Raw traces: tests-unit/output-actual/
This folder contains the raw traces of promise-related operations in JavaScript code. Each file contains the trace of an input file (with the same name) in a human-readable format.
- JSON traces: tests-unit/output-actual/json-logs/
This folder contains the raw traces, but in JSON format. Each JSON log file attributes to an input JavaScript file with the same name.
- Inferred graphs in JSON format: tests-unit/output-actual/graphs/
This folder contains the graphs inferred from the traces in JSON format.
- Visualized graphs and textual reports: tests-unit/output-actual/graph-vis/
This forlder contains the visual representation of each graph, overlaid with information about inferred anti-patterns. A textual report accompanies each graph to provide an overview of discovered anti-patterns.

