const setRank = (todos, priority, id) => {
  let x = 0;
  let i = 0;
  if (id) {
    const oldPriority = todos.findIndex((t) => t.id === id) + 1;
    if (
      oldPriority === priority ||
      todos.length === 1 ||
      (oldPriority === todos.length && priority > todos.length)
    )
      return todos[oldPriority - 1].rank;
    x = oldPriority < priority ? 1 : 0;
    i = 1;
  }

  const rank =
    priority === 1
      ? Math.floor(todos[0].rank / 2)
      : priority > todos.length - i
      ? todos[todos.length - 1].rank + 1000000
      : Math.floor(
          (todos[priority - 2 + x].rank + todos[priority - 1 + x].rank) / 2
        );

  return rank;
};

exports.setRank = setRank;
