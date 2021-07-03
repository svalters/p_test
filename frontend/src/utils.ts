const headers = {
  "Content-Type": "application/json",
}

export const get = (url: string) =>
  fetch(url, {
    method: "GET",
    headers,
  }).then(res => res.json())

export const post = (url: string, body: Record<string, any>) =>
  fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  }).then(res => res.json())
