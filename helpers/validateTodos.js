const validateTodos = (todos) => {
  const prioritySet = new Set();

  for (let todo of todos) {
    if (
      !todo.text ||
      !(typeof todo.priority === "number") ||
      !(typeof todo.done === "boolean")
    ) {
      return "request not valid";
    }

    prioritySet.add(todo.priority);
  }

  if (!(prioritySet.size === todos.length)) {
    return "request not valid";
  }

  if (todos.lenth > 2000) {
    return "list to long. limit = 2000";
  }
};

module.exports = validateTodos;
