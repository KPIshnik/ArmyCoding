const todos = [{ priority: 1 }, { priority: 1 }];

let prioritySet = new Set();

for (let todo of todos) {
  prioritySet.add(todo.priority);
}

console.log(prioritySet.size);

if (!(prioritySet.size === todos.length)) {
  console.log("lol");
}
