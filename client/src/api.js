const request = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error("Something went wrong. Please try again.");
  return response.status === 204 ? null : response.json();
};

export const taskApi = {
  list: () => request("/api/tasks"),
  create: (title) => request("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }) }),
  toggle: (id) => request(`/api/tasks/${id}/toggle`, { method: "PATCH" }),
  remove: (id) => request(`/api/tasks/${id}`, { method: "DELETE" })
};
