const repositoryList = document.querySelector("#repository-list");
const listStatus = document.querySelector("#list-status");

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Could not load repositories (${response.status}).`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list.");
    }

    for (const repository of repositories) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = repository.url;
      link.textContent = repository.name;

      const description = document.createElement("p");
      description.textContent = repository.description;

      const date = document.createElement("time");
      date.dateTime = repository.starredAt;
      date.textContent = `Starred on ${repository.starredAt}`;

      item.append(link, description, date);
      repositoryList.append(item);
    }

    listStatus.textContent = repositories.length === 0
      ? "No starred repositories yet."
      : "";
  } catch (error) {
    console.error("Unable to display starred repositories:", error);
    listStatus.textContent = "Repositories couldn't be loaded. Please try again later.";
  }
}

loadRepositories();
