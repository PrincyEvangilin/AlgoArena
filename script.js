document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       DOM ELEMENTS
    ===================================================== */

    const categorySelect =
        document.getElementById("categorySelect");

    const algorithmSelect =
        document.getElementById("algorithmSelect");

    const sizeRange =
        document.getElementById("sizeRange");

    const sizeValue =
        document.getElementById("sizeValue");

    const speedRange =
        document.getElementById("speedRange");

    const speedValue =
        document.getElementById("speedValue");

    const generateButton =
        document.getElementById("generateButton");

    const startButton =
        document.getElementById("startButton");

    const pauseButton =
        document.getElementById("pauseButton");

    const resetButton =
        document.getElementById("resetButton");

    const arrayContainer =
        document.getElementById("arrayContainer");

    const structureContainer =
        document.getElementById("structureContainer");

    const structureControls =
        document.getElementById("structureControls");

    const stackButtons =
        document.getElementById("stackButtons");

    const queueButtons =
        document.getElementById("queueButtons");

    const linkedListButtons =
        document.getElementById("linkedListButtons");

    const searchTargetBox =
        document.getElementById("searchTargetBox");

    const searchTarget =
        document.getElementById("searchTarget");

    const structureValue =
        document.getElementById("structureValue");

    const visualizerTitle =
        document.getElementById("visualizerTitle");

    const visualizerDescription =
        document.getElementById("visualizerDescription");

    const complexityValue =
        document.getElementById("complexityValue");

    const statusMessage =
        document.getElementById("statusMessage");

    const comparisonCount =
        document.getElementById("comparisonCount");

    const swapCount =
        document.getElementById("swapCount");

    const stepCount =
        document.getElementById("stepCount");

    const legend =
        document.getElementById("legend");

    const themeButton =
        document.getElementById("themeButton");


    /* Structure buttons */

    const pushButton =
        document.getElementById("pushButton");

    const popButton =
        document.getElementById("popButton");

    const peekStackButton =
        document.getElementById("peekStackButton");

    const enqueueButton =
        document.getElementById("enqueueButton");

    const dequeueButton =
        document.getElementById("dequeueButton");

    const peekQueueButton =
        document.getElementById("peekQueueButton");

    const insertButton =
        document.getElementById("insertButton");

    const deleteButton =
        document.getElementById("deleteButton");

    const searchListButton =
        document.getElementById("searchListButton");


    /* =====================================================
       STATE
    ===================================================== */

    const state = {

        category: "sorting",

        algorithm: "bubble",

        data: [],

        originalData: [],

        stack: [],
        originalStack: [],

        queue: [],
        originalQueue: [],

        linkedList: [],
        originalLinkedList: [],

        running: false,

        paused: false,

        cancelToken: 0,

        comparisons: 0,

        swaps: 0,

        steps: 0
    };


    /* =====================================================
       ALGORITHM INFORMATION
    ===================================================== */

    const algorithmInfo = {

        bubble: {
            name: "Bubble Sort",
            description:
                "Compare adjacent elements and swap them when they are in the wrong order.",
            complexity: "O(n²)"
        },

        selection: {
            name: "Selection Sort",
            description:
                "Find the smallest element in the unsorted part and place it in its correct position.",
            complexity: "O(n²)"
        },

        insertion: {
            name: "Insertion Sort",
            description:
                "Take one element at a time and insert it into the correct position in the sorted part.",
            complexity: "O(n²)"
        },

        linear: {
            name: "Linear Search",
            description:
                "Check each element from left to right until the target is found.",
            complexity: "O(n)"
        },

        binary: {
            name: "Binary Search",
            description:
                "Repeatedly divide a sorted array into two halves and search the relevant half.",
            complexity: "O(log n)"
        },

        stack: {
            name: "Stack",
            description:
                "A LIFO structure where the last inserted element is the first one removed.",
            complexity: "O(1)"
        },

        queue: {
            name: "Queue",
            description:
                "A FIFO structure where the first inserted element is the first one removed.",
            complexity: "O(1)"
        },

        linkedlist: {
            name: "Linked List",
            description:
                "A sequence of nodes where each node points to the next node.",
            complexity: "O(n)"
        }
    };


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    function initialize() {

        updateAlgorithmOptions();

        generateData();

        updateSpeedText();

        updateSizeText();

        updateTheme();

        updateInterface();
    }


    /* =====================================================
       CANCEL CURRENT ANIMATION
    ===================================================== */

    function cancelAnimation() {

        state.cancelToken++;

        state.running = false;

        state.paused = false;

        pauseButton.textContent = "❚❚ Pause";
    }


    /* =====================================================
       RESET STATS
    ===================================================== */

    function resetStats() {

        state.comparisons = 0;

        state.swaps = 0;

        state.steps = 0;

        updateStats();
    }


    function updateStats() {

        comparisonCount.textContent =
            state.comparisons;

        swapCount.textContent =
            state.swaps;

        stepCount.textContent =
            state.steps;
    }


    /* =====================================================
       STATUS
    ===================================================== */

    function setStatus(message) {

        statusMessage.textContent = message;
    }


    /* =====================================================
       DELAY / PAUSE
    ===================================================== */

    function getDelay() {

        const speed = Number(speedRange.value);

        if (speed === 1) return 650;

        if (speed === 2) return 350;

        return 120;
    }


    async function wait(ms, token) {

        while (state.paused) {

            if (token !== state.cancelToken) {
                throw new Error("cancelled");
            }

            await new Promise(resolve =>
                setTimeout(resolve, 80)
            );
        }

        await new Promise(resolve =>
            setTimeout(resolve, ms)
        );

        if (token !== state.cancelToken) {
            throw new Error("cancelled");
        }
    }


    /* =====================================================
       GENERATE RANDOM ARRAY
    ===================================================== */

    function createRandomArray(size) {

        const result = [];

        for (let i = 0; i < size; i++) {

            result.push(
                Math.floor(
                    Math.random() * 85
                ) + 10
            );
        }

        return result;
    }


    /* =====================================================
       GENERATE DATA
    ===================================================== */

    function generateData() {

        cancelAnimation();

        resetStats();

        const size =
            Number(sizeRange.value);


        if (
            state.category === "sorting" ||
            state.category === "searching"
        ) {

            state.data =
                createRandomArray(size);

            state.originalData =
                [...state.data];

            renderArray();

            if (state.category === "sorting") {

                setStatus(
                    "New array generated. Press Start to visualize the sorting algorithm."
                );

            } else {

                setStatus(
                    "New array generated. Enter a target and press Start."
                );
            }

            return;
        }


        if (state.category === "stack") {

            state.stack =
                createRandomArray(
                    Math.min(size, 8)
                );

            state.originalStack =
                [...state.stack];

            renderStack();

            setStatus(
                "New stack generated. Use Push, Pop or Peek."
            );

            return;
        }


        if (state.category === "queue") {

            state.queue =
                createRandomArray(
                    Math.min(size, 8)
                );

            state.originalQueue =
                [...state.queue];

            renderQueue();

            setStatus(
                "New queue generated. Use Enqueue, Dequeue or Peek."
            );

            return;
        }


        if (state.category === "linkedlist") {

            state.linkedList =
                createRandomArray(
                    Math.min(size, 7)
                );

            state.originalLinkedList =
                [...state.linkedList];

            renderLinkedList();

            setStatus(
                "New linked list generated. Use Insert, Delete or Search."
            );
        }
    }


    /* =====================================================
       RENDER ARRAY
    ===================================================== */

    function renderArray(states = {}) {

        arrayContainer.innerHTML = "";

        state.data.forEach((value, index) => {

            const bar =
                document.createElement("div");

            bar.className = "bar";

            const height =
                Math.max(35, value * 2.4);

            bar.style.height =
                `${height}px`;

            if (states[index]) {

                states[index].forEach(className => {

                    bar.classList.add(className);

                });
            }

            const label =
                document.createElement("span");

            label.textContent = value;

            bar.appendChild(label);

            arrayContainer.appendChild(bar);
        });
    }


    /* =====================================================
       RENDER SORTED PREFIX
    ===================================================== */

    function renderSortedPrefix(count) {

        const states = {};

        for (let i = 0; i < count; i++) {

            states[i] = ["sorted"];
        }

        renderArray(states);
    }


    /* =====================================================
       RENDER SORTED END
    ===================================================== */

    function renderSortedEnd(count) {

        const states = {};

        const start =
            state.data.length - count;

        for (
            let i = start;
            i < state.data.length;
            i++
        ) {

            states[i] = ["sorted"];
        }

        renderArray(states);
    }


    /* =====================================================
       RENDER ALL SORTED
    ===================================================== */

    function renderAllSorted() {

        const states = {};

        state.data.forEach((_, index) => {

            states[index] = ["sorted"];

        });

        renderArray(states);
    }


    /* =====================================================
       BUBBLE SORT
    ===================================================== */

    async function bubbleSort(token) {

        const n =
            state.data.length;

        for (
            let i = 0;
            i < n - 1;
            i++
        ) {

            for (
                let j = 0;
                j < n - i - 1;
                j++
            ) {

                state.comparisons++;

                state.steps++;

                updateStats();

                const states = {};

                states[j] = ["comparing"];

                states[j + 1] = ["comparing"];

                renderArray(states);

                setStatus(
                    `Comparing ${state.data[j]} and ${state.data[j + 1]}`
                );

                await wait(getDelay(), token);


                if (
                    state.data[j] >
                    state.data[j + 1]
                ) {

                    [
                        state.data[j],
                        state.data[j + 1]
                    ] =
                    [
                        state.data[j + 1],
                        state.data[j]
                    ];

                    state.swaps++;

                    state.steps++;

                    updateStats();

                    const swapStates = {};

                    swapStates[j] = ["swapping"];

                    swapStates[j + 1] = ["swapping"];

                    renderArray(swapStates);

                    setStatus(
                        "Swapping because the left value is larger."
                    );

                    await wait(getDelay(), token);
                }
            }

            renderSortedEnd(i + 1);
        }

        renderAllSorted();

        setStatus(
            "Bubble Sort completed."
        );
    }


    /* =====================================================
       SELECTION SORT
    ===================================================== */

    async function selectionSort(token) {

        const n =
            state.data.length;

        for (
            let i = 0;
            i < n - 1;
            i++
        ) {

            let minIndex = i;

            state.steps++;

            renderSortedPrefix(i);

            await wait(getDelay(), token);


            for (
                let j = i + 1;
                j < n;
                j++
            ) {

                state.comparisons++;

                state.steps++;

                const states = {};

                states[i] = ["swapping"];

                states[minIndex] = ["swapping"];

                states[j] = ["comparing"];

                for (
                    let k = 0;
                    k < i;
                    k++
                ) {

                    states[k] = ["sorted"];
                }

                renderArray(states);

                setStatus(
                    `Looking for the smallest value in the unsorted section.`
                );

                updateStats();

                await wait(getDelay(), token);


                if (
                    state.data[j] <
                    state.data[minIndex]
                ) {

                    minIndex = j;
                }
            }


            if (minIndex !== i) {

                [
                    state.data[i],
                    state.data[minIndex]
                ] =
                [
                    state.data[minIndex],
                    state.data[i]
                ];

                state.swaps++;

                state.steps++;

                updateStats();

                const states = {};

                states[i] = ["swapping"];

                states[minIndex] = ["swapping"];

                for (
                    let k = 0;
                    k < i;
                    k++
                ) {

                    states[k] = ["sorted"];
                }

                renderArray(states);

                setStatus(
                    `Placing ${state.data[i]} into its correct position.`
                );

                await wait(getDelay(), token);
            }
        }

        renderAllSorted();

        setStatus(
            "Selection Sort completed."
        );
    }


    /* =====================================================
       INSERTION SORT
    ===================================================== */

    async function insertionSort(token) {

        const n =
            state.data.length;

        for (
            let i = 1;
            i < n;
            i++
        ) {

            const key =
                state.data[i];

            let j =
                i - 1;

            state.steps++;

            const states = {};

            states[i] = ["swapping"];

            for (
                let k = 0;
                k < i;
                k++
            ) {

                states[k] = ["sorted"];
            }

            renderArray(states);

            setStatus(
                `Taking ${key} and finding its correct position.`
            );

            await wait(getDelay(), token);


            while (
                j >= 0 &&
                state.data[j] > key
            ) {

                state.comparisons++;

                state.steps++;

                state.data[j + 1] =
                    state.data[j];

                const shiftStates = {};

                for (
                    let k = 0;
                    k < i;
                    k++
                ) {

                    shiftStates[k] = ["sorted"];
                }

                shiftStates[j] = ["comparing"];

                shiftStates[j + 1] = ["swapping"];

                renderArray(shiftStates);

                setStatus(
                    `Moving ${state.data[j + 1]} one position to the right.`
                );

                updateStats();

                await wait(getDelay(), token);

                j--;
            }


            state.data[j + 1] = key;

            state.swaps++;

            state.steps++;

            updateStats();

            const finalStates = {};

            for (
                let k = 0;
                k <= i;
                k++
            ) {

                finalStates[k] = ["sorted"];
            }

            renderArray(finalStates);

            await wait(getDelay(), token);
        }

        renderAllSorted();

        setStatus(
            "Insertion Sort completed."
        );
    }


    /* =====================================================
       LINEAR SEARCH
    ===================================================== */

    async function linearSearch(token) {

        const target =
            Number(searchTarget.value);


        if (
            searchTarget.value.trim() === "" ||
            !Number.isFinite(target)
        ) {

            setStatus(
                "Please enter a valid search target."
            );

            return;
        }


        for (
            let i = 0;
            i < state.data.length;
            i++
        ) {

            state.comparisons++;

            state.steps++;

            const states = {};

            states[i] = ["comparing"];

            renderArray(states);

            updateStats();

            setStatus(
                `Checking index ${i}: ${state.data[i]}`
            );

            await wait(getDelay(), token);


            if (
                state.data[i] === target
            ) {

                const foundStates = {};

                foundStates[i] = ["found"];

                renderArray(foundStates);

                state.steps++;

                updateStats();

                setStatus(
                    `Target ${target} found at index ${i}.`
                );

                return;
            }
        }


        renderArray();

        setStatus(
            `Target ${target} was not found.`
        );
    }


    /* =====================================================
       BINARY SEARCH
    ===================================================== */

    async function binarySearch(token) {

        const target =
            Number(searchTarget.value);


        if (
            searchTarget.value.trim() === "" ||
            !Number.isFinite(target)
        ) {

            setStatus(
                "Please enter a valid search target."
            );

            return;
        }


        /* Binary Search requires sorted data */

        state.data.sort(
            (a, b) => a - b
        );

        renderArray();

        setStatus(
            "Binary Search first sorts the array because it requires sorted data."
        );

        await wait(getDelay(), token);


        let left = 0;

        let right =
            state.data.length - 1;


        while (left <= right) {

            const states = {};

            for (
                let i = 0;
                i < state.data.length;
                i++
            ) {

                if (
                    i < left ||
                    i > right
                ) {

                    states[i] = ["range"];
                }
            }


            const mid =
                Math.floor(
                    (left + right) / 2
                );


            states[mid] = ["mid"];

            renderArray(states);

            state.comparisons++;

            state.steps++;

            updateStats();

            setStatus(
                `Checking middle value ${state.data[mid]} at index ${mid}.`
            );

            await wait(getDelay(), token);


            if (
                state.data[mid] === target
            ) {

                const foundStates = {};

                foundStates[mid] = ["found"];

                renderArray(foundStates);

                state.steps++;

                updateStats();

                setStatus(
                    `Target ${target} found at index ${mid}.`
                );

                return;
            }


            if (
                state.data[mid] < target
            ) {

                setStatus(
                    `${target} is larger. Searching the right half.`
                );

                left =
                    mid + 1;

            } else {

                setStatus(
                    `${target} is smaller. Searching the left half.`
                );

                right =
                    mid - 1;
            }

            await wait(getDelay(), token);
        }


        renderArray();

        setStatus(
            `Target ${target} was not found.`
        );
    }


    /* =====================================================
       STACK
    ===================================================== */

    function renderStack(highlightIndex = -1) {

        arrayContainer.classList.add("hidden");

        structureContainer.classList.remove("hidden");

        structureContainer.innerHTML = "";


        if (state.stack.length === 0) {

            structureContainer.innerHTML = `
                <div class="empty-structure">
                    Stack is empty.<br>
                    Use <strong>Push</strong> to add an element.
                </div>
            `;

            return;
        }


        const wrapper =
            document.createElement("div");

        wrapper.className = "stack-visual";


        state.stack.forEach(
            (value, index) => {

                const item =
                    document.createElement("div");

                item.className =
                    "stack-item";

                if (
                    index === highlightIndex
                ) {

                    item.classList.add(
                        "highlight"
                    );
                }

                item.textContent =
                    value;

                wrapper.appendChild(item);
            }
        );


        structureContainer.appendChild(wrapper);
    }


    function stackPush() {

        const value =
            Number(structureValue.value);


        if (
            structureValue.value.trim() === "" ||
            !Number.isFinite(value)
        ) {

            setStatus(
                "Enter a valid value to Push."
            );

            return;
        }


        state.stack.push(value);

        structureValue.value = "";

        renderStack(
            state.stack.length - 1
        );

        state.steps++;

        updateStats();

        setStatus(
            `${value} pushed onto the top of the stack.`
        );
    }


    function stackPop() {

        if (state.stack.length === 0) {

            setStatus(
                "Stack is empty. Nothing to Pop."
            );

            return;
        }


        const removed =
            state.stack.pop();

        renderStack();

        state.steps++;

        updateStats();

        setStatus(
            `${removed} popped from the top of the stack.`
        );
    }


    function stackPeek() {

        if (state.stack.length === 0) {

            setStatus(
                "Stack is empty."
            );

            return;
        }


        const topIndex =
            state.stack.length - 1;

        const top =
            state.stack[topIndex];

        renderStack(topIndex);

        state.steps++;

        updateStats();

        setStatus(
            `Peek: ${top} is currently at the top.`
        );
    }


    /* =====================================================
       QUEUE
    ===================================================== */

    function renderQueue(highlightIndex = -1) {

        arrayContainer.classList.add("hidden");

        structureContainer.classList.remove("hidden");

        structureContainer.innerHTML = "";


        if (state.queue.length === 0) {

            structureContainer.innerHTML = `
                <div class="empty-structure">
                    Queue is empty.<br>
                    Use <strong>Enqueue</strong> to add an element.
                </div>
            `;

            return;
        }


        const wrapper =
            document.createElement("div");

        wrapper.className =
            "queue-visual";


        wrapper.innerHTML = `
            <div class="queue-labels">
                <span>FRONT</span>
                <span>REAR</span>
            </div>
        `;


        const items =
            document.createElement("div");

        items.className =
            "queue-items";


        state.queue.forEach(
            (value, index) => {

                const item =
                    document.createElement("div");

                item.className =
                    "queue-item";

                if (
                    index === highlightIndex
                ) {

                    item.classList.add(
                        "highlight"
                    );
                }

                item.textContent =
                    value;

                items.appendChild(item);
            }
        );


        wrapper.appendChild(items);

        structureContainer.appendChild(wrapper);
    }


    function queueEnqueue() {

        const value =
            Number(structureValue.value);


        if (
            structureValue.value.trim() === "" ||
            !Number.isFinite(value)
        ) {

            setStatus(
                "Enter a valid value to Enqueue."
            );

            return;
        }


        state.queue.push(value);

        structureValue.value = "";

        renderQueue(
            state.queue.length - 1
        );

        state.steps++;

        updateStats();

        setStatus(
            `${value} added to the rear of the queue.`
        );
    }


    function queueDequeue() {

        if (state.queue.length === 0) {

            setStatus(
                "Queue is empty. Nothing to Dequeue."
            );

            return;
        }


        const removed =
            state.queue.shift();

        renderQueue();

        state.steps++;

        updateStats();

        setStatus(
            `${removed} removed from the front of the queue.`
        );
    }


    function queuePeek() {

        if (state.queue.length === 0) {

            setStatus(
                "Queue is empty."
            );

            return;
        }


        renderQueue(0);

        state.steps++;

        updateStats();

        setStatus(
            `Peek: ${state.queue[0]} is at the front.`
        );
    }


    /* =====================================================
       LINKED LIST
    ===================================================== */

    function renderLinkedList(highlightIndex = -1) {

        arrayContainer.classList.add("hidden");

        structureContainer.classList.remove("hidden");

        structureContainer.innerHTML = "";


        if (state.linkedList.length === 0) {

            structureContainer.innerHTML = `
                <div class="empty-structure">
                    Linked List is empty.<br>
                    Use <strong>Insert</strong> to add a node.
                </div>
            `;

            return;
        }


        const wrapper =
            document.createElement("div");

        wrapper.className =
            "linked-list-visual";


        state.linkedList.forEach(
            (value, index) => {

                const node =
                    document.createElement("div");

                node.className =
                    "list-node";

                if (
                    index === highlightIndex
                ) {

                    node.classList.add(
                        "highlight"
                    );
                }

                node.textContent =
                    value;

                wrapper.appendChild(node);


                if (
                    index <
                    state.linkedList.length - 1
                ) {

                    const arrow =
                        document.createElement("span");

                    arrow.className =
                        "arrow";

                    arrow.textContent =
                        "→";

                    wrapper.appendChild(
                        arrow
                    );
                }
            }
        );


        const end =
            document.createElement("span");

        end.className =
            "arrow";

        end.textContent =
            "→ NULL";

        wrapper.appendChild(end);


        structureContainer.appendChild(
            wrapper
        );
    }


    function linkedListInsert() {

        const value =
            Number(structureValue.value);


        if (
            structureValue.value.trim() === "" ||
            !Number.isFinite(value)
        ) {

            setStatus(
                "Enter a valid value to Insert."
            );

            return;
        }


        state.linkedList.push(value);

        const index =
            state.linkedList.length - 1;

        structureValue.value = "";

        renderLinkedList(index);

        state.steps++;

        updateStats();

        setStatus(
            `${value} inserted at the end of the linked list.`
        );
    }


    function linkedListDelete() {

        const value =
            Number(structureValue.value);


        if (
            structureValue.value.trim() === "" ||
            !Number.isFinite(value)
        ) {

            setStatus(
                "Enter the value of the node you want to Delete."
            );

            return;
        }


        const index =
            state.linkedList.indexOf(value);


        if (index === -1) {

            setStatus(
                `${value} is not present in the linked list.`
            );

            return;
        }


        state.linkedList.splice(
            index,
            1
        );

        structureValue.value = "";

        renderLinkedList();

        state.steps++;

        updateStats();

        setStatus(
            `${value} deleted from the linked list.`
        );
    }


    async function linkedListSearch() {

        const value =
            Number(structureValue.value);


        if (
            structureValue.value.trim() === "" ||
            !Number.isFinite(value)
        ) {

            setStatus(
                "Enter a valid value to Search."
            );

            return;
        }


        for (
            let i = 0;
            i < state.linkedList.length;
            i++
        ) {

            renderLinkedList(i);

            state.comparisons++;

            state.steps++;

            updateStats();

            setStatus(
                `Checking node ${i + 1}: ${state.linkedList[i]}`
            );

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        getDelay()
                    )
            );


            if (
                state.linkedList[i] === value
            ) {

                renderLinkedList(i);

                setStatus(
                    `${value} found at node ${i + 1}.`
                );

                return;
            }
        }


        renderLinkedList();

        setStatus(
            `${value} was not found in the linked list.`
        );
    }


    /* =====================================================
       UPDATE ALGORITHM OPTIONS
    ===================================================== */

    function updateAlgorithmOptions() {

        algorithmSelect.innerHTML = "";


        let options = [];


        if (
            state.category === "sorting"
        ) {

            options = [
                ["bubble", "Bubble Sort"],
                ["selection", "Selection Sort"],
                ["insertion", "Insertion Sort"]
            ];
        }


        if (
            state.category === "searching"
        ) {

            options = [
                ["linear", "Linear Search"],
                ["binary", "Binary Search"]
            ];
        }


        if (
            state.category === "stack"
        ) {

            options = [
                ["stack", "Stack Operations"]
            ];
        }


        if (
            state.category === "queue"
        ) {

            options = [
                ["queue", "Queue Operations"]
            ];
        }


        if (
            state.category === "linkedlist"
        ) {

            options = [
                ["linkedlist", "Linked List Operations"]
            ];
        }


        options.forEach(
            ([value, text]) => {

                const option =
                    document.createElement("option");

                option.value =
                    value;

                option.textContent =
                    text;

                algorithmSelect.appendChild(
                    option
                );
            }
        );


        state.algorithm =
            options[0][0];

        updateAlgorithmInfo();
    }


    /* =====================================================
       UPDATE ALGORITHM INFO
    ===================================================== */

    function updateAlgorithmInfo() {

        const info =
            algorithmInfo[state.algorithm];


        if (!info) return;


        visualizerTitle.textContent =
            info.name;

        visualizerDescription.textContent =
            info.description;

        complexityValue.textContent =
            info.complexity;
    }


    /* =====================================================
       UPDATE INTERFACE
    ===================================================== */

    function updateInterface() {

        const isStructure =
            ["stack", "queue", "linkedlist"]
                .includes(state.category);

        const isSearch =
            state.category === "searching";


        /* Search target */

        searchTargetBox.classList.toggle(
            "hidden",
            !isSearch
        );


        /* Structure controls */

        structureControls.classList.toggle(
            "hidden",
            !isStructure
        );


        stackButtons.classList.toggle(
            "hidden",
            state.category !== "stack"
        );

        queueButtons.classList.toggle(
            "hidden",
            state.category !== "queue"
        );

        linkedListButtons.classList.toggle(
            "hidden",
            state.category !== "linkedlist"
        );


        /* Main visualizer */

        if (isStructure) {

            arrayContainer.classList.add(
                "hidden"
            );

            structureContainer.classList.remove(
                "hidden"
            );

            startButton.classList.add(
                "hidden"
            );

            pauseButton.classList.add(
                "hidden"
            );

            legend.classList.add(
                "hidden"
            );

        } else {

            arrayContainer.classList.remove(
                "hidden"
            );

            structureContainer.classList.add(
                "hidden"
            );

            startButton.classList.remove(
                "hidden"
            );

            pauseButton.classList.remove(
                "hidden"
            );

            legend.classList.remove(
                "hidden"
            );
        }


        /* Placeholder */

        if (
            state.category === "stack"
        ) {

            structureValue.placeholder =
                "Value to push";

        } else if (
            state.category === "queue"
        ) {

            structureValue.placeholder =
                "Value to enqueue";

        } else if (
            state.category === "linkedlist"
        ) {

            structureValue.placeholder =
                "Value";
        }


        updateAlgorithmInfo();
    }


    /* =====================================================
       START VISUALIZATION
    ===================================================== */

    async function startVisualization() {

        if (
            state.category === "stack" ||
            state.category === "queue" ||
            state.category === "linkedlist"
        ) {

            setStatus(
                "Use the operation buttons for this data structure."
            );

            return;
        }


        if (state.running) {

            return;
        }


        if (
            state.paused
        ) {

            state.paused = false;

            state.running = true;

            setStatus(
                "Visualization resumed."
            );

            return;
        }


        cancelAnimation();

        state.running = true;

        state.paused = false;

        const token =
            state.cancelToken;


        resetStats();


        try {

            if (
                state.category === "sorting"
            ) {

                if (
                    state.algorithm === "bubble"
                ) {

                    await bubbleSort(token);

                } else if (
                    state.algorithm === "selection"
                ) {

                    await selectionSort(token);

                } else if (
                    state.algorithm === "insertion"
                ) {

                    await insertionSort(token);
                }

            } else if (
                state.category === "searching"
            ) {

                if (
                    state.algorithm === "linear"
                ) {

                    await linearSearch(token);

                } else if (
                    state.algorithm === "binary"
                ) {

                    await binarySearch(token);
                }
            }

        } catch (error) {

            if (
                error.message !== "cancelled"
            ) {

                console.error(error);

                setStatus(
                    "Something went wrong. Please reset and try again."
                );
            }

        } finally {

            if (
                token === state.cancelToken
            ) {

                state.running = false;

                state.paused = false;

                pauseButton.textContent =
                    "❚❚ Pause";
            }
        }
    }


    /* =====================================================
       PAUSE
    ===================================================== */

    function pauseVisualization() {

        if (!state.running) {

            return;
        }


        state.paused =
            !state.paused;


        if (state.paused) {

            pauseButton.textContent =
                "▶ Resume";

            setStatus(
                "Visualization paused."
            );

        } else {

            pauseButton.textContent =
                "❚❚ Pause";

            setStatus(
                "Visualization resumed."
            );
        }
    }


    /* =====================================================
       RESET
    ===================================================== */

    function resetData() {

        cancelAnimation();

        resetStats();


        if (
            state.category === "sorting" ||
            state.category === "searching"
        ) {

            state.data =
                [...state.originalData];

            renderArray();

            setStatus(
                "Data reset to the generated state."
            );

            return;
        }


        if (
            state.category === "stack"
        ) {

            state.stack =
                [...state.originalStack];

            renderStack();

            setStatus(
                "Stack reset to its generated state."
            );

            return;
        }


        if (
            state.category === "queue"
        ) {

            state.queue =
                [...state.originalQueue];

            renderQueue();

            setStatus(
                "Queue reset to its generated state."
            );

            return;
        }


        if (
            state.category === "linkedlist"
        ) {

            state.linkedList =
                [...state.originalLinkedList];

            renderLinkedList();

            setStatus(
                "Linked List reset to its generated state."
            );
        }
    }


    /* =====================================================
       CATEGORY CHANGE
    ===================================================== */

    categorySelect.addEventListener(
        "change",
        () => {

            cancelAnimation();

            state.category =
                categorySelect.value;

            resetStats();

            updateAlgorithmOptions();

            updateInterface();

            generateData();
        }
    );


    /* =====================================================
       ALGORITHM CHANGE
    ===================================================== */

    algorithmSelect.addEventListener(
        "change",
        () => {

            cancelAnimation();

            state.algorithm =
                algorithmSelect.value;

            resetStats();

            updateAlgorithmInfo();

            if (
                state.category === "sorting" ||
                state.category === "searching"
            ) {

                renderArray();
            }
        }
    );


    /* =====================================================
       SIZE
    ===================================================== */

    sizeRange.addEventListener(
        "input",
        () => {

            updateSizeText();
        }
    );


    function updateSizeText() {

        sizeValue.textContent =
            sizeRange.value;
    }


    /* =====================================================
       SPEED
    ===================================================== */

    speedRange.addEventListener(
        "input",
        updateSpeedText
    );


    function updateSpeedText() {

        const speed =
            Number(speedRange.value);

        if (speed === 1) {

            speedValue.textContent =
                "Slow";

        } else if (speed === 2) {

            speedValue.textContent =
                "Medium";

        } else {

            speedValue.textContent =
                "Fast";
        }
    }


    /* =====================================================
       MAIN BUTTONS
    ===================================================== */

    generateButton.addEventListener(
        "click",
        generateData
    );


    startButton.addEventListener(
        "click",
        startVisualization
    );


    pauseButton.addEventListener(
        "click",
        pauseVisualization
    );


    resetButton.addEventListener(
        "click",
        resetData
    );


    /* =====================================================
       STACK BUTTONS
    ===================================================== */

    pushButton.addEventListener(
        "click",
        stackPush
    );

    popButton.addEventListener(
        "click",
        stackPop
    );

    peekStackButton.addEventListener(
        "click",
        stackPeek
    );


    /* =====================================================
       QUEUE BUTTONS
    ===================================================== */

    enqueueButton.addEventListener(
        "click",
        queueEnqueue
    );

    dequeueButton.addEventListener(
        "click",
        queueDequeue
    );

    peekQueueButton.addEventListener(
        "click",
        queuePeek
    );


    /* =====================================================
       LINKED LIST BUTTONS
    ===================================================== */

    insertButton.addEventListener(
        "click",
        linkedListInsert
    );

    deleteButton.addEventListener(
        "click",
        linkedListDelete
    );

    searchListButton.addEventListener(
        "click",
        linkedListSearch
    );


    /* =====================================================
       ENTER KEY
    ===================================================== */

    structureValue.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Enter"
            ) return;


            if (
                state.category === "stack"
            ) {

                stackPush();

            } else if (
                state.category === "queue"
            ) {

                queueEnqueue();

            } else if (
                state.category === "linkedlist"
            ) {

                linkedListInsert();
            }
        }
    );


    searchTarget.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                startVisualization();
            }
        }
    );


    /* =====================================================
       THEME
    ===================================================== */

    themeButton.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );

            localStorage.setItem(
                "algoarena-theme",
                document.body.classList.contains(
                    "dark"
                )
                    ? "dark"
                    : "light"
            );
        }
    );


    function updateTheme() {

        const savedTheme =
            localStorage.getItem(
                "algoarena-theme"
            );

        if (
            savedTheme === "dark"
        ) {

            document.body.classList.add(
                "dark"
            );
        }
    }


    /* =====================================================
       START APP
    ===================================================== */

    initialize();

});