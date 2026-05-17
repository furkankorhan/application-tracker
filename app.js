const STORAGE_KEY = "furkan.application-tracker.entries";

const demoEntries = [
  { id: crypto.randomUUID(), company: "Example IT GmbH", role: "Fachinformatiker/in Systemintegration", city: "Hannover", link: "https://example.com", status: "research", nextAction: "Check requirements and documents" },
  { id: crypto.randomUUID(), company: "Digital Solutions AG", role: "Fachinformatiker/in Anwendungsentwicklung", city: "Hildesheim", link: "https://example.com/jobs", status: "ready", nextAction: "Adapt Anschreiben" },
];

const form = document.querySelector("#application-form");
const entryId = document.querySelector("#entry-id");
const company = document.querySelector("#company");
const role = document.querySelector("#role");
const city = document.querySelector("#city");
const link = document.querySelector("#link");
const status = document.querySelector("#status");
const nextAction = document.querySelector("#next-action");
const list = document.querySelector("#application-list");
const filter = document.querySelector("#status-filter");
const emptyState = document.querySelector("#empty-state");
const totalCount = document.querySelector("#total-count");

let entries = loadEntries();

function loadEntries() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoEntries));
    return demoEntries;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getVisibleEntries() {
  if (filter.value === "all") return entries;
  return entries.filter((entry) => entry.status === filter.value);
}

function render() {
  const visibleEntries = getVisibleEntries();
  totalCount.textContent = entries.length;
  list.innerHTML = "";
  emptyState.hidden = visibleEntries.length > 0;

  for (const entry of visibleEntries) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(entry.company)}</td>
      <td>${escapeHtml(entry.role)}</td>
      <td>${escapeHtml(entry.city || "-")}</td>
      <td><span class="status">${escapeHtml(entry.status)}</span></td>
      <td>${escapeHtml(entry.nextAction || "-")}</td>
      <td>${entry.link ? `<a href="${escapeAttribute(entry.link)}" target="_blank" rel="noopener noreferrer">Open</a>` : "-"}</td>
      <td>
        <div class="row-actions">
          <button type="button" class="ghost" data-action="edit" data-id="${entry.id}">Edit</button>
          <button type="button" class="ghost danger" data-action="delete" data-id="${entry.id}">Delete</button>
        </div>
      </td>`;
    list.appendChild(row);
  }
}

function resetForm() {
  entryId.value = "";
  form.reset();
  status.value = "research";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = {
    id: entryId.value || crypto.randomUUID(),
    company: company.value.trim(),
    role: role.value.trim(),
    city: city.value.trim(),
    link: link.value.trim(),
    status: status.value,
    nextAction: nextAction.value.trim(),
  };

  if (!data.company || !data.role) return;

  const existingIndex = entries.findIndex((entry) => entry.id === data.id);
  if (existingIndex >= 0) entries[existingIndex] = data;
  else entries.unshift(data);

  saveEntries();
  resetForm();
  render();
});

list.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const selected = entries.find((entry) => entry.id === button.dataset.id);
  if (!selected) return;

  if (button.dataset.action === "edit") {
    entryId.value = selected.id;
    company.value = selected.company;
    role.value = selected.role;
    city.value = selected.city;
    link.value = selected.link;
    status.value = selected.status;
    nextAction.value = selected.nextAction;
    company.focus();
  }

  if (button.dataset.action === "delete") {
    entries = entries.filter((entry) => entry.id !== selected.id);
    saveEntries();
    render();
  }
});

filter.addEventListener("change", render);
document.querySelector("#cancel-edit").addEventListener("click", resetForm);
document.querySelector("#reset-demo").addEventListener("click", () => {
  entries = demoEntries.map((entry) => ({ ...entry, id: crypto.randomUUID() }));
  saveEntries();
  resetForm();
  render();
});

document.querySelector("#export-json").addEventListener("click", () => {
  downloadFile("applications.json", JSON.stringify(entries, null, 2), "application/json");
});

document.querySelector("#export-csv").addEventListener("click", () => {
  const header = ["company", "role", "city", "status", "nextAction", "link"];
  const rows = entries.map((entry) => header.map((key) => `"${String(entry[key] || "").replaceAll('"', '""')}"`).join(","));
  downloadFile("applications.csv", [header.join(","), ...rows].join("\n"), "text/csv");
});

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

render();
