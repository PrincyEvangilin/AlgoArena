/* =========================================================
   ALGOARENA — PREMIUM V4
   Interactive DSA Visualizer
========================================================= */


/* =========================================================
   DOM
========================================================= */

const $ = (id) => document.getElementById(id);


/* =========================================================
   STATE
========================================================= */

let currentConcept = "sorting";
let currentAlgorithm = "bubble";

let arrayData = [];
let originalArray = [];

let stackData = [];
let originalStack = [];

let queueData = [];
let originalQueue = [];

let linkedData = [];
let originalLinked = [];

let treeValues = [];
let originalTreeValues = [];

let graphData = null;

let stats = {
  comparisons: 0,
  steps: 0,
  swaps: 0
};

let isRunning = false;
let isPaused = false;
let stepMode = false;

let stopToken = 0;
let stepResolver = null;


/* =========================================================
   PROGRESS
========================================================= */

let progressData = JSON.parse(
  localStorage.getItem("algoarenaProgress")
) || {
  explored: [],
  challengesSolved: 0,
  streak: 0,
  xp: 0
};


/* =========================================================
   ALGORITHM INFORMATION
========================================================= */

const algorithmInfo = {

  bubble: {
    title: "Bubble Sort",
    concept: "Sorting",
    description:
      "Bubble Sort repeatedly compares adjacent elements and swaps them when they are in the wrong order.",

    steps: [
      "Compare two adjacent elements.",
      "Swap them if the left element is greater.",
      "Continue through the array.",
      "Repeat until no swaps are required."
    ],

    pseudocode:
`for i = 0 to n - 1
    for j = 0 to n - i - 2
        if A[j] > A[j + 1]
            swap(A[j], A[j + 1])`,

    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)"
  },


  selection: {
    title: "Selection Sort",
    concept: "Sorting",
    description:
      "Selection Sort repeatedly finds the smallest element from the unsorted part and places it at the beginning.",

    steps: [
      "Start from the first unsorted position.",
      "Find the smallest element in the remaining array.",
      "Swap it with the first unsorted element.",
      "Move the boundary forward."
    ],

    pseudocode:
`for i = 0 to n - 2
    min = i
    for j = i + 1 to n - 1
        if A[j] < A[min]
            min = j
    swap(A[i], A[min])`,

    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)"
  },


  insertion: {
    title: "Insertion Sort",
    concept: "Sorting",
    description:
      "Insertion Sort builds the sorted portion one element at a time by inserting each value into its correct position.",

    steps: [
      "Treat the first element as sorted.",
      "Pick the next element.",
      "Move larger elements one position right.",
      "Insert the selected element."
    ],

    pseudocode:
`for i = 1 to n - 1
    key = A[i]
    j = i - 1

    while j >= 0 and A[j] > key
        A[j + 1] = A[j]
        j = j - 1

    A[j + 1] = key`,

    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)"
  },


  merge: {
    title: "Merge Sort",
    concept: "Sorting",
    description:
      "Merge Sort divides the array into smaller pieces, sorts them recursively, and merges the sorted pieces.",

    steps: [
      "Divide the array into two halves.",
      "Recursively sort both halves.",
      "Compare the smallest remaining elements.",
      "Merge them into one sorted array."
    ],

    pseudocode:
`mergeSort(A)
    if length(A) <= 1
        return A

    divide A into left and right
    mergeSort(left)
    mergeSort(right)
    merge(left, right)`,

    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)"
  },


  quick: {
    title: "Quick Sort",
    concept: "Sorting",
    description:
      "Quick Sort selects a pivot and partitions the array so smaller values go left and larger values go right.",

    steps: [
      "Choose a pivot.",
      "Partition values around the pivot.",
      "Place the pivot in its correct position.",
      "Recursively sort both partitions."
    ],

    pseudocode:
`quickSort(A, low, high)
    if low < high
        p = partition(A, low, high)
        quickSort(A, low, p - 1)
        quickSort(A, p + 1, high)`,

    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)"
  },


  linear: {
    title: "Linear Search",
    concept: "Searching",
    description:
      "Linear Search checks elements one by one until the target is found or the array ends.",

    steps: [
      "Start at the first element.",
      "Compare it with the target.",
      "Move to the next element if it does not match.",
      "Stop when the target is found or the array ends."
    ],

    pseudocode:
`for i = 0 to n - 1
    if A[i] == target
        return i

return -1`,

    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)"
  },


  binary: {
    title: "Binary Search",
    concept: "Searching",
    description:
      "Binary Search repeatedly divides a sorted search range in half.",

    steps: [
      "Find the middle element.",
      "Compare the middle with the target.",
      "Discard the half that cannot contain the target.",
      "Repeat until found or the range becomes empty."
    ],

    pseudocode:
`low = 0
high = n - 1

while low <= high
    mid = floor((low + high) / 2)

    if A[mid] == target
        return mid
    else if A[mid] < target
        low = mid + 1
    else
        high = mid - 1

return -1`,

    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)",
    space: "O(1)"
  },


  bfs: {
    title: "Breadth-First Search",
    concept: "Graph",
    description:
      "BFS explores a graph level by level using a queue.",

    steps: [
      "Choose a starting node.",
      "Put it into a queue.",
      "Visit the front node and add its unvisited neighbours.",
      "Continue until the queue becomes empty."
    ],

    pseudocode:
`BFS(start)
    queue = [start]
    visited = {start}

    while queue is not empty
        node = dequeue(queue)
        visit(node)

        for each neighbour
            if neighbour not visited
                visited.add(neighbour)
                enqueue(neighbour)`,

    best: "O(V + E)",
    average: "O(V + E)",
    worst: "O(V + E)",
    space: "O(V)"
  },


  dfs: {
    title: "Depth-First Search",
    concept: "Graph",
    description:
      "DFS explores as deeply as possible before backtracking.",

    steps: [
      "Choose a starting node.",
      "Mark it as visited.",
      "Visit an unvisited neighbour.",
      "Continue deeply and backtrack when necessary."
    ],

    pseudocode:
`DFS(node)
    mark node visited
    visit(node)

    for each neighbour
        if neighbour not visited
            DFS(neighbour)`,

    best: "O(V + E)",
    average: "O(V + E)",
    worst: "O(V + E)",
    space: "O(V)"
  }

};


/* =========================================================
   DATA STRUCTURE INFORMATION
========================================================= */

const structureInfo = {

  stack: {
    title: "Stack",
    concept: "Data Structure",
    description:
      "A Stack follows LIFO — Last In, First Out. The most recently added element is removed first.",

    steps: [
      "Push adds an element to the top.",
      "Pop removes the top element.",
      "Peek reads the top element without removing it.",
      "Only the top of the stack is directly accessible."
    ],

    pseudocode:
`push(value)
    add value to top

pop()
    remove top value

peek()
    return top value`,

    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    space: "O(n)"
  },


  queue: {
    title: "Queue",
    concept: "Data Structure",
    description:
      "A Queue follows FIFO — First In, First Out. The earliest inserted element leaves first.",

    steps: [
      "Enqueue adds an element at the rear.",
      "Dequeue removes an element from the front.",
      "Peek reads the front element.",
      "Elements leave in the same order they entered."
    ],

    pseudocode:
`enqueue(value)
    add value to rear

dequeue()
    remove front value

peek()
    return front value`,

    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    space: "O(n)"
  },


  linkedlist: {
    title: "Linked List",
    concept: "Data Structure",
    description:
      "A Linked List stores elements in nodes where each node points to another node.",

    steps: [
      "Each node stores data.",
      "A pointer/reference connects nodes.",
      "Insertion changes links instead of shifting an entire array.",
      "Doubly linked lists maintain both next and previous links."
    ],

    pseudocode:
`insert(value)
    create new node
    connect node to list

delete(value)
    find node
    reconnect neighbouring nodes

search(value)
    traverse nodes until found`,

    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(n)"
  },


  tree: {
    title: "Binary Search Tree",
    concept: "Tree",
    description:
      "A Binary Search Tree keeps smaller values on the left and larger values on the right.",

    steps: [
      "Compare the new value with the current node.",
      "Go left if it is smaller.",
      "Go right if it is larger.",
      "Repeat until an empty position is found."
    ],

    pseudocode:
`insert(node, value)
    if node is null
        return new node

    if value < node.value
        node.left = insert(node.left, value)
    else
        node.right = insert(node.right, value)

    return node`,

    best: "O(log n)",
    average: "O(log n)",
    worst: "O(n)",
    space: "O(n)"
  }

};


/* =========================================================
   GRAPH DATA
========================================================= */

function createGraph() {

  return {
    nodes: [0, 1, 2, 3, 4, 5],

    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 4],
      [2, 5],
      [4, 5]
    ]
  };

}


graphData = createGraph();


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  setupEvents();

  configureConcept("sorting");

  generateData();

  renderChallenge();

  updateProgressUI();

  updateHeroStats();

});


/* =========================================================
   EVENTS
========================================================= */

function setupEvents() {

  $("conceptSelect").addEventListener("change", e => {
    configureConcept(e.target.value);
    generateData();
  });


  $("algorithmSelect").addEventListener("change", e => {

    currentAlgorithm = e.target.value;

    updateLearningPanel();

    generateData();

  });


  $("generateBtn").addEventListener("click", generateData);


  $("startBtn").addEventListener(
    "click",
    () => startVisualization(false)
  );


  $("pauseBtn").addEventListener(
    "click",
    togglePause
  );


  $("stepBtn").addEventListener(
    "click",
    nextStep
  );


  $("resetBtn").addEventListener(
    "click",
    resetVisualization
  );


  $("speedRange").addEventListener("input", e => {

    $("speedValue").textContent = e.target.value;

  });


  $("themeBtn").addEventListener("click", toggleTheme);


  $("heroStart").addEventListener("click", () => {

    $("visualizer").scrollIntoView({
      behavior: "smooth"
    });

  });


  $("heroExplore").addEventListener("click", () => {

    $("concepts").scrollIntoView({
      behavior: "smooth"
    });

  });


  document
    .querySelectorAll(".concept-card")
    .forEach(card => {

      card.addEventListener("click", () => {

        const concept = card.dataset.concept;

        configureConcept(concept);

        generateData();

        $("visualizer").scrollIntoView({
          behavior: "smooth"
        });

      });

    });


  document
    .querySelectorAll(".operation-btn")
    .forEach(button => {

      button.addEventListener("click", () => {

        performStructureAction(
          button.dataset.action
        );

      });

    });


  $("nextQuestion").addEventListener(
    "click",
    nextChallenge
  );

}


/* =========================================================
   CONCEPT CONFIGURATION
========================================================= */

function configureConcept(concept) {

  currentConcept = concept;

  $("conceptSelect").value = concept;


  const algorithmSelect = $("algorithmSelect");

  algorithmSelect.innerHTML = "";


  if (concept === "sorting") {

    addAlgorithm("bubble", "Bubble Sort");
    addAlgorithm("selection", "Selection Sort");
    addAlgorithm("insertion", "Insertion Sort");
    addAlgorithm("merge", "Merge Sort");
    addAlgorithm("quick", "Quick Sort");

    currentAlgorithm = "bubble";

    $("algorithmField").classList.remove("hidden");
    $("customInputField").classList.remove("hidden");
    $("targetField").classList.add("hidden");

    $("customInputLabel").textContent = "CUSTOM ARRAY";
    $("customInput").placeholder = "8, 3, 6, 1, 9";

    hideStructureControls();

    $("visualizerTitle").textContent =
      "Sorting Visualizer";

    $("visualizerDescription").textContent =
      "Compare, swap, divide and conquer — watch sorting algorithms happen step-by-step.";

  }


  else if (concept === "searching") {

    addAlgorithm("linear", "Linear Search");
    addAlgorithm("binary", "Binary Search");

    currentAlgorithm = "linear";

    $("algorithmField").classList.remove("hidden");
    $("customInputField").classList.remove("hidden");
    $("targetField").classList.remove("hidden");

    $("customInputLabel").textContent = "SEARCH ARRAY";
    $("customInput").placeholder = "8, 3, 6, 1, 9";

    hideStructureControls();

    $("visualizerTitle").textContent =
      "Searching Visualizer";

    $("visualizerDescription").textContent =
      "Give the algorithm a target and watch it narrow down the answer.";

  }


  else if (concept === "graph") {

    addAlgorithm("bfs", "Breadth-First Search");
    addAlgorithm("dfs", "Depth-First Search");

    currentAlgorithm = "bfs";

    $("algorithmField").classList.remove("hidden");

    $("customInputField").classList.add("hidden");
    $("targetField").classList.add("hidden");

    hideStructureControls();

    $("visualizerTitle").textContent =
      "Graph Visualizer";

    $("visualizerDescription").textContent =
      "Explore a real graph using BFS and DFS traversal.";

  }


  else {

    $("algorithmField").classList.add("hidden");
    $("customInputField").classList.add("hidden");
    $("targetField").classList.add("hidden");

    showStructureControls(concept);

    if (concept === "stack") {

      $("visualizerTitle").textContent =
        "Stack Visualizer";

      $("visualizerDescription").textContent =
        "A Stack follows LIFO — Last In, First Out. The most recently added element is removed first.";

    }

    if (concept === "queue") {

      $("visualizerTitle").textContent =
        "Queue Visualizer";

      $("visualizerDescription").textContent =
        "A Queue follows FIFO — First In, First Out.";

    }

    if (concept === "linkedlist") {

      $("visualizerTitle").textContent =
        "Linked List Visualizer";

      $("visualizerDescription").textContent =
        "Explore nodes, links, insertion, deletion and searching.";

    }

    if (concept === "tree") {

      $("visualizerTitle").textContent =
        "Tree Visualizer";

      $("visualizerDescription").textContent =
        "Build a Binary Search Tree and explore its structure.";

    }

  }


  markConceptActive();

  updateLearningPanel();

}


function addAlgorithm(value, label) {

  const option =
    document.createElement("option");

  option.value = value;
  option.textContent = label;

  $("algorithmSelect").appendChild(option);

}


function markConceptActive() {

  document
    .querySelectorAll(".concept-card")
    .forEach(card => {

      card.classList.toggle(
        "active",
        card.dataset.concept === currentConcept
      );

    });

}


/* =========================================================
   STRUCTURE CONTROL UI
========================================================= */

function hideStructureControls() {

  $("structureControls")
    .classList.add("hidden");

}


function showStructureControls(concept) {

  $("structureControls")
    .classList.remove("hidden");

  $("stackButtons")
    .classList.add("hidden");

  $("queueButtons")
    .classList.add("hidden");

  $("linkedButtons")
    .classList.add("hidden");

  $("queueOptions")
    .classList.add("hidden");

  $("linkedOptions")
    .classList.add("hidden");


  if (concept === "stack") {

    $("stackButtons")
      .classList.remove("hidden");

  }


  if (concept === "queue") {

    $("queueButtons")
      .classList.remove("hidden");

    $("queueOptions")
      .classList.remove("hidden");

  }


  if (concept === "linkedlist") {

    $("linkedButtons")
      .classList.remove("hidden");

    $("linkedOptions")
      .classList.remove("hidden");

  }

}


/* =========================================================
   GENERATE DATA
========================================================= */

function generateData() {

  stopVisualization();

  resetStats();


  if (
    currentConcept === "sorting" ||
    currentConcept === "searching"
  ) {

    let values =
      parseArrayInput(
        $("customInput").value
      );


    if (values.length < 2) {

      values = randomArray();

    }


    if (
      currentConcept === "searching" &&
      currentAlgorithm === "binary"
    ) {

      values.sort((a, b) => a - b);

    }


    arrayData = [...values];
    originalArray = [...values];

    renderArray();

    $("visualOutputTitle").textContent =
      currentConcept === "sorting"
        ? "Array"
        : "Search Array";

    $("operationMessage").textContent =
      currentConcept === "searching"
        ? "Enter a target value and press Start."
        : "Generated a new array.";

  }


  else if (currentConcept === "stack") {

    stackData = [12, 24, 36];
    originalStack = [...stackData];

    renderStack();

    $("visualOutputTitle").textContent =
      "Stack";

    $("operationMessage").textContent =
      "Stack ready. Push, Pop or Peek.";

  }


  else if (currentConcept === "queue") {

    queueData = [12, 24, 36];
    originalQueue = [...queueData];

    renderQueue();

    $("visualOutputTitle").textContent =
      "Queue";

    $("operationMessage").textContent =
      "Queue ready. Enqueue, Dequeue or Peek.";

  }


  else if (currentConcept === "linkedlist") {

    linkedData = [12, 24, 36];
    originalLinked = [...linkedData];

    renderLinkedList();

    $("visualOutputTitle").textContent =
      "Linked List";

    $("operationMessage").textContent =
      "Linked List ready.";

  }


  else if (currentConcept === "tree") {

    treeValues = [50, 30, 70, 20, 40, 60, 80];
    originalTreeValues = [...treeValues];

    renderTree();

    $("visualOutputTitle").textContent =
      "Binary Search Tree";

    $("operationMessage").textContent =
      "BST generated successfully.";

  }


  else if (currentConcept === "graph") {

    graphData = createGraph();

    renderGraph([], null);

    $("visualOutputTitle").textContent =
      "Graph";

    $("operationMessage").textContent =
      currentAlgorithm === "bfs"
        ? "BFS ready — traversal starts at node 0."
        : "DFS ready — traversal starts at node 0.";

  }


  updateLearningPanel();
  updateStatsUI();

}


/* =========================================================
   ARRAY INPUT
========================================================= */

function parseArrayInput(text) {

  if (!text.trim()) {
    return [];
  }


  return text
    .split(",")
    .map(value => Number(value.trim()))
    .filter(value => Number.isFinite(value))
    .slice(0, 15);

}


function randomArray() {

  return Array.from(
    { length: 8 },
    () =>
      Math.floor(Math.random() * 90) + 10
  );

}


/* =========================================================
   ARRAY RENDER
========================================================= */

function renderArray(
  compare = [],
  swap = [],
  sorted = [],
  found = [],
  range = [],
  pivot = []
) {

  const area = $("visualArea");

  area.innerHTML = "";


  const container =
    document.createElement("div");

  container.className = "array-container";


  if (!arrayData.length) {

    container.textContent =
      "No data";

    area.appendChild(container);

    return;

  }


  const maxAbs =
    Math.max(
      ...arrayData.map(v => Math.abs(v)),
      1
    );


  arrayData.forEach((value, index) => {

    const bar =
      document.createElement("div");

    bar.className = "array-bar";


    const height =
      Math.max(
        12,
        (Math.abs(value) / maxAbs) * 190
      );


    bar.style.height =
      `${height}px`;


    bar.textContent = value;


    if (compare.includes(index)) {
      bar.classList.add("compare");
    }


    if (swap.includes(index)) {
      bar.classList.add("swap");
    }


    if (sorted.includes(index)) {
      bar.classList.add("sorted");
    }


    if (found.includes(index)) {
      bar.classList.add("found");
    }


    if (
      range.length &&
      !range.includes(index)
    ) {

      bar.classList.add("range-out");

    }


    if (pivot.includes(index)) {
      bar.classList.add("pivot");
    }


    container.appendChild(bar);

  });


  area.appendChild(container);

}


/* =========================================================
   STATS
========================================================= */

function resetStats() {

  stats = {
    comparisons: 0,
    steps: 0,
    swaps: 0
  };

}


function updateStatsUI() {

  $("comparisonStat").textContent =
    stats.comparisons;

  $("stepStat").textContent =
    stats.steps;

  $("swapStat").textContent =
    stats.swaps;

  updateHeroStats();

}


function updateHeroStats() {

  $("heroComparisons").textContent =
    stats.comparisons;

  $("heroSteps").textContent =
    stats.steps;

}


/* =========================================================
   VISUALIZATION CONTROL
========================================================= */

async function startVisualization(forceStep = false) {

  if (isRunning) {
    return;
  }


  if (currentConcept === "stack" ||
      currentConcept === "queue" ||
      currentConcept === "linkedlist" ||
      currentConcept === "tree") {

    showMessage(
      "Use the structure operation buttons below the main controls."
    );

    return;

  }


  if (
    currentConcept === "searching"
  ) {

    const target =
      Number($("targetInput").value);

    if (!Number.isFinite(target)) {

      showMessage(
        "Enter a target value before starting the search."
      );

      $("targetInput").focus();

      return;

    }

  }


  isRunning = true;
  isPaused = false;
  stepMode = forceStep;

  stopToken++;

  const token = stopToken;


  $("startBtn").textContent =
    "Running";


  $("startBtn").disabled = true;


  try {

    if (currentConcept === "sorting") {

      await runSorting(token);

    }

    else if (currentConcept === "searching") {

      await runSearching(token);

    }

    else if (currentConcept === "graph") {

      if (currentAlgorithm === "bfs") {

        await runBFS(token);

      } else {

        await runDFS(token);

      }

    }


  } catch (error) {

    console.error(error);

    showMessage(
      "Something went wrong. Press Reset and try again."
    );

  }


  if (token === stopToken) {

    isRunning = false;
    isPaused = false;
    stepMode = false;

    $("startBtn").disabled = false;
    $("startBtn").textContent = "Start";

  }

}


/* =========================================================
   PAUSE
========================================================= */

function togglePause() {

  if (!isRunning) {
    return;
  }


  isPaused = !isPaused;


  $("pauseBtn").textContent =
    isPaused ? "Resume" : "Pause";


  if (!isPaused && stepResolver) {

    const resolve =
      stepResolver;

    stepResolver = null;

    resolve();

  }

}


/* =========================================================
   STEP
========================================================= */

function nextStep() {

  if (!isRunning) {

    startVisualization(true);

    return;

  }


  if (stepResolver) {

    const resolve =
      stepResolver;

    stepResolver = null;

    resolve();

  }

}


/* =========================================================
   WAIT
========================================================= */

function waitForNext(token) {

  if (token !== stopToken) {
    return Promise.resolve();
  }


  if (isPaused || stepMode) {

    return new Promise(resolve => {

      stepResolver = resolve;

    });

  }


  const speed =
    Number($("speedRange").value);


  const delay =
    Math.max(80, 1100 - speed);


  return new Promise(resolve => {

    setTimeout(resolve, delay);

  });

}


/* =========================================================
   STOP
========================================================= */

function stopVisualization() {

  stopToken++;

  isRunning = false;
  isPaused = false;
  stepMode = false;

  if (stepResolver) {

    const resolve =
      stepResolver;

    stepResolver = null;

    resolve();

  }


  $("startBtn").disabled = false;
  $("startBtn").textContent = "Start";

  $("pauseBtn").textContent = "Pause";

}


/* =========================================================
   SORTING
========================================================= */

async function runSorting(token) {

  if (currentAlgorithm === "bubble") {

    await bubbleSort(token);

  }

  else if (currentAlgorithm === "selection") {

    await selectionSort(token);

  }

  else if (currentAlgorithm === "insertion") {

    await insertionSort(token);

  }

  else if (currentAlgorithm === "merge") {

    await mergeSort(
      0,
      arrayData.length - 1,
      token
    );

  }

  else if (currentAlgorithm === "quick") {

    await quickSort(
      0,
      arrayData.length - 1,
      token
    );

  }


  if (token !== stopToken) {
    return;
  }


  const sorted =
    arrayData.map((_, i) => i);

  renderArray([], [], sorted);

  stats.steps++;

  updateStatsUI();

  showStep(
    "Complete",
    `${algorithmInfo[currentAlgorithm].title} finished successfully.`
  );

  markExplored(currentAlgorithm);

}


/* ---------------- BUBBLE ---------------- */

async function bubbleSort(token) {

  const n =
    arrayData.length;


  for (let i = 0; i < n - 1; i++) {

    let swapped = false;


    for (let j = 0; j < n - i - 1; j++) {

      if (token !== stopToken) return;


      stats.comparisons++;
      stats.steps++;


      renderArray(
        [j, j + 1]
      );


      showStep(
        "Compare",
        `Comparing ${arrayData[j]} and ${arrayData[j + 1]}.`
      );


      updateStatsUI();

      await waitForNext(token);


      if (
        arrayData[j] >
        arrayData[j + 1]
      ) {

        [
          arrayData[j],
          arrayData[j + 1]
        ] =
        [
          arrayData[j + 1],
          arrayData[j]
        ];


        stats.swaps++;
        swapped = true;


        renderArray(
          [],
          [j, j + 1]
        );


        showStep(
          "Swap",
          "The adjacent elements were in the wrong order."
        );


        updateStatsUI();

        await waitForNext(token);

      }

    }


    if (!swapped) {
      break;
    }

  }

}


/* ---------------- SELECTION ---------------- */

async function selectionSort(token) {

  const n =
    arrayData.length;


  for (let i = 0; i < n - 1; i++) {

    let minIndex = i;


    for (
      let j = i + 1;
      j < n;
      j++
    ) {

      if (token !== stopToken) return;


      stats.comparisons++;
      stats.steps++;


      renderArray(
        [minIndex, j],
        [],
        Array.from(
          { length: i },
          (_, k) => k
        )
      );


      showStep(
        "Find minimum",
        `Checking whether ${arrayData[j]} is smaller than the current minimum.`
      );


      updateStatsUI();

      await waitForNext(token);


      if (
        arrayData[j] <
        arrayData[minIndex]
      ) {

        minIndex = j;

      }

    }


    if (minIndex !== i) {

      [
        arrayData[i],
        arrayData[minIndex]
      ] =
      [
        arrayData[minIndex],
        arrayData[i]
      ];


      stats.swaps++;
      stats.steps++;


      renderArray(
        [],
        [i, minIndex]
      );


      showStep(
        "Place minimum",
        `${arrayData[i]} is now in its correct position.`
      );


      updateStatsUI();

      await waitForNext(token);

    }

  }

}


/* ---------------- INSERTION ---------------- */

async function insertionSort(token) {

  for (
    let i = 1;
    i < arrayData.length;
    i++
  ) {

    const key =
      arrayData[i];

    let j =
      i - 1;


    while (
      j >= 0 &&
      arrayData[j] > key
    ) {

      if (token !== stopToken) return;


      stats.comparisons++;
      stats.steps++;


      renderArray(
        [j, j + 1],
        [],
        Array.from(
          { length: i },
          (_, k) => k
        )
      );


      showStep(
        "Shift",
        `${arrayData[j]} moves right to make room for ${key}.`
      );


      updateStatsUI();

      await waitForNext(token);


      arrayData[j + 1] =
        arrayData[j];


      j--;

    }


    arrayData[j + 1] =
      key;


    renderArray(
      [],
      [j + 1]
    );


    await waitForNext(token);

  }

}


/* ---------------- MERGE ---------------- */

async function mergeSort(
  left,
  right,
  token
) {

  if (left >= right) {
    return;
  }


  const middle =
    Math.floor(
      (left + right) / 2
    );


  await mergeSort(
    left,
    middle,
    token
  );


  await mergeSort(
    middle + 1,
    right,
    token
  );


  await mergeParts(
    left,
    middle,
    right,
    token
  );

}


async function mergeParts(
  left,
  middle,
  right,
  token
) {

  const leftPart =
    arrayData.slice(
      left,
      middle + 1
    );

  const rightPart =
    arrayData.slice(
      middle + 1,
      right + 1
    );


  let i = 0;
  let j = 0;
  let k = left;


  while (
    i < leftPart.length &&
    j < rightPart.length
  ) {

    if (token !== stopToken) return;


    stats.comparisons++;
    stats.steps++;


    renderArray(
      [left + i, middle + 1 + j]
    );


    showStep(
      "Merge",
      "Comparing elements from the two sorted halves."
    );


    updateStatsUI();

    await waitForNext(token);


    if (
      leftPart[i] <=
      rightPart[j]
    ) {

      arrayData[k] =
        leftPart[i];

      i++;

    } else {

      arrayData[k] =
        rightPart[j];

      j++;

    }


    k++;


    renderArray(
      [],
      [k - 1]
    );


    await waitForNext(token);

  }


  while (i < leftPart.length) {

    arrayData[k++] =
      leftPart[i++];

    stats.steps++;

    renderArray([], [k - 1]);

    await waitForNext(token);

  }


  while (j < rightPart.length) {

    arrayData[k++] =
      rightPart[j++];

    stats.steps++;

    renderArray([], [k - 1]);

    await waitForNext(token);

  }

}


/* ---------------- QUICK ---------------- */

async function quickSort(
  low,
  high,
  token
) {

  if (low >= high) {
    return;
  }


  const pivotIndex =
    await partition(
      low,
      high,
      token
    );


  await quickSort(
    low,
    pivotIndex - 1,
    token
  );


  await quickSort(
    pivotIndex + 1,
    high,
    token
  );

}


async function partition(
  low,
  high,
  token
) {

  const pivot =
    arrayData[high];

  let i =
    low - 1;


  for (
    let j = low;
    j < high;
    j++
  ) {

    if (token !== stopToken) return low;


    stats.comparisons++;
    stats.steps++;


    renderArray(
      [j],
      [],
      [],
      [],
      Array.from(
        { length: high - low + 1 },
        (_, x) => low + x
      ),
      [high]
    );


    showStep(
      "Partition",
      `Comparing ${arrayData[j]} with pivot ${pivot}.`
    );


    updateStatsUI();

    await waitForNext(token);


    if (
      arrayData[j] <
      pivot
    ) {

      i++;


      [
        arrayData[i],
        arrayData[j]
      ] =
      [
        arrayData[j],
        arrayData[i]
      ];


      stats.swaps++;

    }

  }


  [
    arrayData[i + 1],
    arrayData[high]
  ] =
  [
    arrayData[high],
    arrayData[i + 1]
  ];


  stats.swaps++;

  stats.steps++;

  renderArray(
    [],
    [i + 1, high]
  );


  await waitForNext(token);


  return i + 1;

}


/* =========================================================
   SEARCHING
========================================================= */

async function runSearching(token) {

  const target =
    Number($("targetInput").value);


  if (currentAlgorithm === "linear") {

    await linearSearch(
      target,
      token
    );

  }

  else {

    await binarySearch(
      target,
      token
    );

  }

}


/* ---------------- LINEAR ---------------- */

async function linearSearch(
  target,
  token
) {

  for (
    let i = 0;
    i < arrayData.length;
    i++
  ) {

    if (token !== stopToken) return;


    stats.comparisons++;
    stats.steps++;


    renderArray(
      [i]
    );


    showStep(
      "Checking",
      `Checking ${arrayData[i]} against target ${target}.`
    );


    updateStatsUI();

    await waitForNext(token);


    if (
      arrayData[i] === target
    ) {

      renderArray(
        [],
        [],
        [],
        [i]
      );


      showStep(
        "Found!",
        `Target ${target} was found at index ${i}.`
      );


      markExplored("linear");

      return;

    }

  }


  renderArray();

  showStep(
    "Not Found",
    `Target ${target} does not exist in the array.`
  );


  markExplored("linear");

}


/* ---------------- BINARY ---------------- */

async function binarySearch(
  target,
  token
) {

  let low = 0;
  let high =
    arrayData.length - 1;


  while (low <= high) {

    if (token !== stopToken) return;


    const middle =
      Math.floor(
        (low + high) / 2
      );


    stats.comparisons++;
    stats.steps++;


    const range =
      Array.from(
        { length: high - low + 1 },
        (_, i) => low + i
      );


    renderArray(
      [middle],
      [],
      [],
      [],
      range
    );


    showStep(
      "Check middle",
      `Middle value is ${arrayData[middle]}.`
    );


    updateStatsUI();

    await waitForNext(token);


    if (
      arrayData[middle] === target
    ) {

      renderArray(
        [],
        [],
        [],
        [middle]
      );


      showStep(
        "Found!",
        `Target ${target} was found at index ${middle}.`
      );


      markExplored("binary");

      return;

    }


    if (
      arrayData[middle] <
      target
    ) {

      low =
        middle + 1;


      showStep(
        "Move right",
        "The target is larger, so the left half is discarded."
      );

    }

    else {

      high =
        middle - 1;


      showStep(
        "Move left",
        "The target is smaller, so the right half is discarded."
      );

    }


    await waitForNext(token);

  }


  renderArray();

  showStep(
    "Not Found",
    `Target ${target} does not exist in the array.`
  );


  markExplored("binary");

}


/* =========================================================
   STACK
========================================================= */

function performStackAction(action) {

  const input =
    Number($("structureInput").value);


  if (action === "push") {

    if (!Number.isFinite(input)) {

      showMessage(
        "Enter a value before pushing."
      );

      return;

    }


    stackData.push(input);

    stats.steps++;

    renderStack(
      stackData.length - 1
    );


    showStep(
      "Push",
      `${input} was added to the top of the stack.`
    );

  }


  if (action === "pop") {

    if (!stackData.length) {

      showMessage(
        "Stack is empty."
      );

      return;

    }


    const value =
      stackData.pop();


    stats.steps++;

    renderStack();


    showStep(
      "Pop",
      `Popped ${value} from the stack.`
    );

  }


  if (action === "peek") {

    if (!stackData.length) {

      showMessage(
        "Stack is empty."
      );

      return;

    }


    stats.steps++;

    renderStack(
      stackData.length - 1
    );


    showStep(
      "Peek",
      `Top value is ${stackData.at(-1)}.`
    );

  }


  updateStatsUI();

  markExplored("stack");

}


/* =========================================================
   QUEUE
========================================================= */

function performQueueAction(action) {

  const input =
    Number($("structureInput").value);


  if (action === "enqueue") {

    if (!Number.isFinite(input)) {

      showMessage(
        "Enter a value before enqueueing."
      );

      return;

    }


    if (
      $("queueType").value === "circular" &&
      queueData.length >= 6
    ) {

      showMessage(
        "Circular queue capacity is 6."
      );

      return;

    }


    queueData.push(input);

    stats.steps++;

    renderQueue(
      queueData.length - 1
    );


    showStep(
      "Enqueue",
      `${input} was added at the rear of the queue.`
    );

  }


  if (action === "dequeue") {

    if (!queueData.length) {

      showMessage(
        "Queue is empty."
      );

      return;

    }


    const value =
      queueData.shift();


    stats.steps++;

    renderQueue(0);


    showStep(
      "Dequeue",
      `${value} was removed from the front.`
    );

  }


  if (action === "peekQueue") {

    if (!queueData.length) {

      showMessage(
        "Queue is empty."
      );

      return;

    }


    stats.steps++;

    renderQueue(0);


    showStep(
      "Peek",
      `Front value is ${queueData[0]}.`
    );

  }


  updateStatsUI();

  markExplored("queue");

}


/* =========================================================
   LINKED LIST
========================================================= */

function performLinkedAction(action) {

  const input =
    Number($("structureInput").value);


  if (action === "insert") {

    if (!Number.isFinite(input)) {

      showMessage(
        "Enter a value before inserting."
      );

      return;

    }


    linkedData.push(input);

    stats.steps++;

    renderLinkedList(
      linkedData.length - 1
    );


    showStep(
      "Insert",
      `${input} was added as a new node.`
    );

  }


  if (action === "delete") {

    if (!Number.isFinite(input)) {

      showMessage(
        "Enter the value you want to delete."
      );

      return;

    }


    const index =
      linkedData.indexOf(input);


    if (index === -1) {

      showMessage(
        `${input} is not present in the list.`
      );

      return;

    }


    linkedData.splice(
      index,
      1
    );


    stats.steps++;

    renderLinkedList();


    showStep(
      "Delete",
      `${input} was removed from the list.`
    );

  }


  if (action === "search") {

    if (!Number.isFinite(input)) {

      showMessage(
        "Enter a value to search."
      );

      return;

    }


    const index =
      linkedData.indexOf(input);


    stats.comparisons++;
    stats.steps++;


    renderLinkedList(
      index
    );


    if (index !== -1) {

      showStep(
        "Found",
        `${input} was found at node ${index + 1}.`
      );

    } else {

      showStep(
        "Not Found",
        `${input} does not exist in the list.`
      );

    }

  }


  updateStatsUI();

  markExplored("linkedlist");

}


/* =========================================================
   STRUCTURE DISPATCH
========================================================= */

function performStructureAction(action) {

  if (currentConcept === "stack") {

    performStackAction(action);

  }

  else if (currentConcept === "queue") {

    performQueueAction(action);

  }

  else if (currentConcept === "linkedlist") {

    performLinkedAction(action);

  }

}


/* =========================================================
   STACK RENDER
========================================================= */

function renderStack(active = -1) {

  const area =
    $("visualArea");

  area.innerHTML = "";


  const container =
    document.createElement("div");

  container.className =
    "stack-container";


  stackData.forEach(
    (value, index) => {

      const item =
        document.createElement("div");

      item.className =
        "stack-item";


      if (index === active) {

        item.classList.add(
          "active"
        );

      }


      item.textContent =
        value;


      container.appendChild(item);

    }
  );


  area.appendChild(container);

}


/* =========================================================
   QUEUE RENDER
========================================================= */

function renderQueue(active = -1) {

  const area =
    $("visualArea");

  area.innerHTML = "";


  const container =
    document.createElement("div");

  container.className =
    "queue-container";


  queueData.forEach(
    (value, index) => {

      const item =
        document.createElement("div");

      item.className =
        "queue-item";


      if (index === 0) {

        item.classList.add(
          "front"
        );

      }


      if (
        index === queueData.length - 1
      ) {

        item.classList.add(
          "rear"
        );

      }


      if (index === active) {

        item.style.transform =
          "translateY(-5px)";

      }


      item.textContent =
        value;


      container.appendChild(item);

    }
  );


  area.appendChild(container);

}


/* =========================================================
   LINKED LIST RENDER
========================================================= */

function renderLinkedList(
  active = -1
) {

  const area =
    $("visualArea");

  area.innerHTML = "";


  const container =
    document.createElement("div");

  container.className =
    "linked-container";


  linkedData.forEach(
    (value, index) => {

      const node =
        document.createElement("div");

      node.className =
        "list-node";


      if (index === active) {

        node.classList.add(
          "active"
        );

      }


      node.innerHTML = `
        <div class="node-value">
          ${value}
        </div>

        <div class="node-next">
          ${
            $("linkedType").value === "doubly"
              ? "prev ↔ next"
              : "next →"
          }
        </div>
      `;


      container.appendChild(node);


      if (
        index <
        linkedData.length - 1
      ) {

        const arrow =
          document.createElement("div");

        arrow.className =
          "list-arrow";

        arrow.textContent =
          $("linkedType").value === "doubly"
            ? "↔"
            : "→";

        container.appendChild(
          arrow
        );

      }

    }
  );


  area.appendChild(container);

}


/* =========================================================
   BST
========================================================= */

function createBST(values) {

  let root = null;


  function insert(
    node,
    value
  ) {

    if (!node) {

      return {
        value,
        left: null,
        right: null
      };

    }


    if (
      value <
      node.value
    ) {

      node.left =
        insert(
          node.left,
          value
        );

    } else {

      node.right =
        insert(
          node.right,
          value
        );

    }


    return node;

  }


  values.forEach(
    value => {

      root =
        insert(
          root,
          value
        );

    }
  );


  return root;

}


function renderTree(
  currentValue = null,
  visitedValues = []
) {

  const area =
    $("visualArea");

  area.innerHTML = "";


  const svg =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

  svg.classList.add(
    "tree-svg"
  );

  svg.setAttribute(
    "viewBox",
    "0 0 760 340"
  );


  const root =
    createBST(treeValues);


  if (!root) {

    area.appendChild(svg);

    return;

  }


  const positions =
    new Map();

  let order = 0;


  function assignPositions(
    node,
    depth
  ) {

    if (!node) {
      return;
    }


    assignPositions(
      node.left,
      depth + 1
    );


    positions.set(
      node,
      {
        x: 80 + order * 100,
        y: 50 + depth * 90
      }
    );


    order++;


    assignPositions(
      node.right,
      depth + 1
    );

  }


  assignPositions(
    root,
    0
  );


  function drawEdges(node) {

    if (!node) {
      return;
    }


    const current =
      positions.get(node);


    [
      node.left,
      node.right
    ]
      .filter(Boolean)
      .forEach(child => {

        const childPos =
          positions.get(child);


        const line =
          document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
          );


        line.setAttribute(
          "x1",
          current.x
        );

        line.setAttribute(
          "y1",
          current.y
        );

        line.setAttribute(
          "x2",
          childPos.x
        );

        line.setAttribute(
          "y2",
          childPos.y
        );

        line.classList.add(
          "tree-edge"
        );


        svg.appendChild(line);

      });


    drawEdges(node.left);
    drawEdges(node.right);

  }


  drawEdges(root);


  positions.forEach(
    (position, node) => {

      const circle =
        document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );


      circle.setAttribute(
        "cx",
        position.x
      );

      circle.setAttribute(
        "cy",
        position.y
      );

      circle.setAttribute(
        "r",
        "23"
      );


      circle.classList.add(
        "tree-node"
      );


      if (
        node.value === currentValue
      ) {

        circle.classList.add(
          "current"
        );

      }


      if (
        visitedValues.includes(
          node.value
        )
      ) {

        circle.classList.add(
          "visited"
        );

      }


      svg.appendChild(
        circle
      );


      const text =
        document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );


      text.setAttribute(
        "x",
        position.x
      );

      text.setAttribute(
        "y",
        position.y
      );


      text.classList.add(
        "tree-text"
      );


      text.textContent =
        node.value;


      svg.appendChild(
        text
      );

    }
  );


  area.appendChild(svg);

}


/* =========================================================
   GRAPH RENDER
========================================================= */

const graphPositions = {
  0: [100, 150],
  1: [260, 65],
  2: [260, 235],
  3: [450, 50],
  4: [450, 250],
  5: [620, 150]
};


function renderGraph(
  visited = [],
  current = null
) {

  const area =
    $("visualArea");

  area.innerHTML = "";


  const wrapper =
    document.createElement("div");

  wrapper.className =
    "graph-container";


  const svg =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );


  svg.classList.add(
    "graph-svg"
  );


  svg.setAttribute(
    "viewBox",
    "0 0 720 300"
  );


  /* EDGES */

  graphData.edges.forEach(
    ([a, b]) => {

      const [x1, y1] =
        graphPositions[a];

      const [x2, y2] =
        graphPositions[b];


      const line =
        document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );


      line.setAttribute(
        "x1",
        x1
      );

      line.setAttribute(
        "y1",
        y1
      );

      line.setAttribute(
        "x2",
        x2
      );

      line.setAttribute(
        "y2",
        y2
      );


      line.classList.add(
        "graph-edge"
      );


      svg.appendChild(
        line
      );

    }
  );


  /* NODES */

  graphData.nodes.forEach(
    node => {

      const [x, y] =
        graphPositions[node];


      const circle =
        document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );


      circle.setAttribute(
        "cx",
        x
      );

      circle.setAttribute(
        "cy",
        y
      );

      circle.setAttribute(
        "r",
        "25"
      );


      circle.classList.add(
        "graph-node"
      );


      if (
        visited.includes(node)
      ) {

        circle.classList.add(
          "visited"
        );

      }


      if (
        current === node
      ) {

        circle.classList.add(
          "current"
        );

      }


      svg.appendChild(
        circle
      );


      const text =
        document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );


      text.setAttribute(
        "x",
        x
      );

      text.setAttribute(
        "y",
        y
      );


      text.classList.add(
        "graph-text"
      );


      text.textContent =
        node;


      svg.appendChild(
        text
      );

    }
  );


  wrapper.appendChild(svg);


  const legend =
    document.createElement("div");

  legend.className =
    "graph-legend";


  legend.innerHTML = `
    <div class="legend-item">
      <span class="legend-dot normal"></span>
      Unvisited
    </div>

    <div class="legend-item">
      <span class="legend-dot visited"></span>
      Visited
    </div>

    <div class="legend-item">
      <span class="legend-dot current"></span>
      Current
    </div>
  `;


  wrapper.appendChild(
    legend
  );


  area.appendChild(
    wrapper
  );

}


/* =========================================================
   GRAPH ADJACENCY
========================================================= */

function buildAdjacency() {

  const adjacency = {};

  graphData.nodes.forEach(
    node => {

      adjacency[node] = [];

    }
  );


  graphData.edges.forEach(
    ([a, b]) => {

      adjacency[a].push(b);
      adjacency[b].push(a);

    }
  );


  Object.keys(adjacency)
    .forEach(key => {

      adjacency[key].sort(
        (a, b) => a - b
      );

    });


  return adjacency;

}


/* =========================================================
   BFS
========================================================= */

async function runBFS(token) {

  const adjacency =
    buildAdjacency();


  const queue = [0];

  const visited =
    new Set();

  const order = [];


  while (queue.length) {

    if (token !== stopToken) {
      return;
    }


    const node =
      queue.shift();


    if (
      visited.has(node)
    ) {
      continue;
    }


    visited.add(node);
    order.push(node);


    stats.steps++;


    renderGraph(
      order,
      node
    );


    showStep(
      "BFS Visit",
      `Visited node ${node}. Queue: [${queue.join(", ")}]`
    );


    updateStatsUI();

    await waitForNext(token);


    for (
      const neighbour
      of adjacency[node]
    ) {

      if (
        !visited.has(neighbour) &&
        !queue.includes(neighbour)
      ) {

        queue.push(
          neighbour
        );

      }

    }


    renderGraph(
      order,
      node
    );


    showStep(
      "Add neighbours",
      `Node ${node} added its unvisited neighbours to the queue. Queue: [${queue.join(", ")}]`
    );


    await waitForNext(token);

  }


  renderGraph(
    order,
    null
  );


  showStep(
    "BFS Complete",
    `Traversal order: ${order.join(" → ")}`
  );


  markExplored("bfs");

}


/* =========================================================
   DFS
========================================================= */

async function runDFS(token) {

  const adjacency =
    buildAdjacency();


  const visited =
    new Set();

  const order = [];


  async function visit(node) {

    if (
      token !== stopToken ||
      visited.has(node)
    ) {

      return;

    }


    visited.add(node);

    order.push(node);


    stats.steps++;


    renderGraph(
      order,
      node
    );


    showStep(
      "DFS Visit",
      `Visited node ${node}. Going deeper before backtracking.`
    );


    updateStatsUI();

    await waitForNext(token);


    for (
      const neighbour
      of adjacency[node]
    ) {

      if (
        !visited.has(neighbour)
      ) {

        await visit(
          neighbour
        );

      }

    }

  }


  await visit(0);


  if (
    token !== stopToken
  ) {

    return;

  }


  renderGraph(
    order,
    null
  );


  showStep(
    "DFS Complete",
    `Traversal order: ${order.join(" → ")}`
  );


  markExplored("dfs");

}


/* =========================================================
   RESET
========================================================= */

function resetVisualization() {

  stopVisualization();

  resetStats();


  if (
    currentConcept === "sorting" ||
    currentConcept === "searching"
  ) {

    arrayData =
      [...originalArray];

    renderArray();

  }


  else if (
    currentConcept === "stack"
  ) {

    stackData =
      [...originalStack];

    renderStack();

  }


  else if (
    currentConcept === "queue"
  ) {

    queueData =
      [...originalQueue];

    renderQueue();

  }


  else if (
    currentConcept === "linkedlist"
  ) {

    linkedData =
      [...originalLinked];

    renderLinkedList();

  }


  else if (
    currentConcept === "tree"
  ) {

    treeValues =
      [...originalTreeValues];

    renderTree();

  }


  else if (
    currentConcept === "graph"
  ) {

    graphData =
      createGraph();

    renderGraph();

  }


  $("operationMessage").textContent =
    "Visualization reset.";


  $("stepTitle").textContent =
    "Ready";


  $("stepDescription").textContent =
    "Choose an algorithm and press Start.";


  updateStatsUI();

}


/* =========================================================
   LEARNING PANEL
========================================================= */

function updateLearningPanel() {

  let info;


  if (
    currentConcept === "sorting" ||
    currentConcept === "searching" ||
    currentConcept === "graph"
  ) {

    info =
      algorithmInfo[
        currentAlgorithm
      ];

  }

  else {

    info =
      structureInfo[
        currentConcept
      ];

  }


  if (!info) {
    return;
  }


  $("learningTitle").textContent =
    info.title;


  $("learningDescription").textContent =
    info.description;


  $("learningBadge").textContent =
    info.concept;


  $("stepsList").innerHTML =
    info.steps
      .map(
        step =>
          `<li>${step}</li>`
      )
      .join("");


  $("pseudocode").textContent =
    info.pseudocode;


  $("bestComplexity").textContent =
    info.best;


  $("averageComplexity").textContent =
    info.average;


  $("worstComplexity").textContent =
    info.worst;


  $("spaceComplexity").textContent =
    info.space;

}


/* =========================================================
   STEP INFORMATION
========================================================= */

function showStep(
  title,
  description
) {

  $("stepTitle").textContent =
    title;

  $("stepDescription").textContent =
    description;

  $("operationMessage").textContent =
    description;

}


function showMessage(message) {

  $("operationMessage").textContent =
    message;

}


/* =========================================================
   PROGRESS
========================================================= */

function markExplored(key) {

  if (
    !progressData.explored.includes(key)
  ) {

    progressData.explored.push(key);

    progressData.xp += 25;

    progressData.streak++;

    localStorage.setItem(
      "algoarenaProgress",
      JSON.stringify(progressData)
    );

    updateProgressUI();

  }

}


function updateProgressUI() {

  $("algorithmsExplored").textContent =
    progressData.explored.length;


  $("challengesSolved").textContent =
    progressData.challengesSolved;


  $("currentStreak").textContent =
    progressData.streak;


  $("xpValue").textContent =
    progressData.xp;


  const totalItems =
    14;


  const percent =
    Math.min(
      100,
      Math.round(
        progressData.explored.length /
        totalItems *
        100
      )
    );


  $("progressPercent").textContent =
    `${percent}%`;


  $("progressFill").style.width =
    `${percent}%`;

}


/* =========================================================
   CHALLENGE DATA
========================================================= */

const challenges = [

  {
    difficulty: "EASY",

    question:
      "Which data structure follows LIFO?",

    answers: [
      "Queue",
      "Stack",
      "Graph",
      "Tree"
    ],

    correct: 1
  },


  {
    difficulty: "EASY",

    question:
      "Which search requires a sorted array?",

    answers: [
      "Linear Search",
      "Binary Search",
      "Bubble Search",
      "Depth Search"
    ],

    correct: 1
  },


  {
    difficulty: "MEDIUM",

    question:
      "What is the average time complexity of Binary Search?",

    answers: [
      "O(n)",
      "O(n²)",
      "O(log n)",
      "O(1)"
    ],

    correct: 2
  },


  {
    difficulty: "MEDIUM",

    question:
      "Which traversal uses a queue?",

    answers: [
      "DFS",
      "BFS",
      "Inorder",
      "Postorder"
    ],

    correct: 1
  },


  {
    difficulty: "MEDIUM",

    question:
      "Which sorting algorithm repeatedly swaps adjacent elements?",

    answers: [
      "Merge Sort",
      "Quick Sort",
      "Bubble Sort",
      "Selection Sort"
    ],

    correct: 2
  },


  {
    difficulty: "HARD",

    question:
      "What is the worst-case complexity of Quick Sort?",

    answers: [
      "O(n)",
      "O(log n)",
      "O(n log n)",
      "O(n²)"
    ],

    correct: 3
  },


  {
    difficulty: "HARD",

    question:
      "Which traversal visits a BST root between its left and right subtrees?",

    answers: [
      "Inorder",
      "BFS",
      "DFS",
      "Level order"
    ],

    correct: 0
  },


  {
    difficulty: "HARD",

    question:
      "What is the time complexity of BFS using an adjacency list?",

    answers: [
      "O(n²)",
      "O(V + E)",
      "O(log n)",
      "O(1)"
    ],

    correct: 1
  }

];


let challengeIndex =
  Number(
    localStorage.getItem(
      "algoarenaChallengeIndex"
    )
  ) || 0;


/* =========================================================
   CHALLENGE RENDER
========================================================= */

function renderChallenge() {

  const challenge =
    challenges[
      challengeIndex %
      challenges.length
    ];


  $("challengeDifficulty")
    .textContent =
    challenge.difficulty;


  $("challengeNumber")
    .textContent =
    challengeIndex + 1;


  $("questionText")
    .textContent =
    challenge.question;


  const answerList =
    $("answerList");

  answerList.innerHTML = "";


  challenge.answers.forEach(
    (answer, index) => {

      const button =
        document.createElement("button");

      button.className =
        "answer-btn";

      button.textContent =
        answer;


      button.addEventListener(
        "click",
        () => {

          answerQuestion(
            index,
            challenge.correct,
            button
          );

        }
      );


      answerList.appendChild(
        button
      );

    }
  );


  $("challengeResult")
    .textContent = "";


  $("nextQuestion")
    .classList.add("hidden");

}


function answerQuestion(
  selected,
  correct,
  clickedButton
) {

  const buttons =
    document.querySelectorAll(
      ".answer-btn"
    );


  buttons.forEach(
    button =>
      button.disabled = true
  );


  if (
    selected === correct
  ) {

    clickedButton.classList.add(
      "correct"
    );


    $("challengeResult")
      .textContent =
      "Correct! +50 XP";


    progressData.xp += 50;

    progressData.challengesSolved++;

  }

  else {

    clickedButton.classList.add(
      "wrong"
    );


    buttons[
      correct
    ].classList.add(
      "correct"
    );


    $("challengeResult")
      .textContent =
      "Not quite. The highlighted answer is correct.";

  }


  localStorage.setItem(
    "algoarenaProgress",
    JSON.stringify(progressData)
  );


  updateProgressUI();


  $("nextQuestion")
    .classList.remove(
      "hidden"
    );

}


function nextChallenge() {

  challengeIndex++;

  localStorage.setItem(
    "algoarenaChallengeIndex",
    challengeIndex
  );


  renderChallenge();

}


/* =========================================================
   THEME
========================================================= */

function toggleTheme() {

  document.body.classList.toggle(
    "light"
  );


  const isLight =
    document.body.classList.contains(
      "light"
    );


  localStorage.setItem(
    "algoarenaTheme",
    isLight
      ? "light"
      : "dark"
  );


  $("themeBtn").textContent =
    isLight ? "☾" : "☼";

}


(function loadTheme() {

  const theme =
    localStorage.getItem(
      "algoarenaTheme"
    );


  if (theme === "light") {

    document.body.classList.add(
      "light"
    );

    $("themeBtn").textContent =
      "☾";

  }

})();


/* =========================================================
   LINKED LIST TYPE CHANGE
========================================================= */

$("linkedType").addEventListener(
  "change",
  () => {

    if (
      currentConcept === "linkedlist"
    ) {

      renderLinkedList();

    }

  }
);


/* =========================================================
   QUEUE TYPE CHANGE
========================================================= */

$("queueType").addEventListener(
  "change",
  () => {

    if (
      currentConcept === "queue"
    ) {

      renderQueue();

    }

  }
);