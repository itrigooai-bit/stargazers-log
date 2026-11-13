const repositoryList = document.querySelector("#repository-list");
const listStatus = document.querySelector("#list-status");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isValidRepository(repository) {
  if (repository === null || typeof repository !== "object") {
    return false;
  }
  if (!isNonEmptyString(repository.name) || !isNonEmptyString(repository.url)) {
    return false;
  }

  try {
    const url = new URL(repository.url, location.href);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function createRepositoryItem(repository) {
  const item = document.createElement("li");

  const link = document.createElement("a");
  link.href = repository.url;
  link.textContent = repository.name;
  item.append(link);

  if (isNonEmptyString(repository.description)) {
    const description = document.createElement("p");
    description.textContent = repository.description;
    item.append(description);
  }

  if (isNonEmptyString(repository.starredAt)) {
    const date = document.createElement("time");
    date.dateTime = repository.starredAt;
    date.textContent = `Starred on ${repository.starredAt}`;
    item.append(date);
  }

  return item;
}

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

    const validRepositories = repositories.filter(isValidRepository);
    const skipped = repositories.length - validRepositories.length;
    if (skipped > 0) {
      console.warn(`Skipped ${skipped} invalid repository entr${skipped === 1 ? "y" : "ies"}.`);
    }

    // Build everything off-DOM first so a failure can't leave a half-rendered list.
    const fragment = document.createDocumentFragment();
    for (const repository of validRepositories) {
      fragment.append(createRepositoryItem(repository));
    }
    repositoryList.append(fragment);

    const count = validRepositories.length;
    listStatus.textContent = count === 0
      ? "No starred repositories yet."
      : `${count} ${count === 1 ? "repository" : "repositories"} loaded.`;
    if (count > 0) {
      listStatus.classList.add("visually-hidden");
    }
  } catch (error) {
    console.error("Unable to display starred repositories:", error);
    listStatus.textContent = "Repositories couldn't be loaded. Please try again later.";
  }
}

loadRepositories();
