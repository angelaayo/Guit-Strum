export function recordAttempt(chordId: string, correct: boolean) {
  fetch("/api/mastery", {
    method: "POST",
    headers: { "Content-Type": "applications/json" },
    body: JSON.stringify({ chordId, correct }),
  }).catch(() => {});
}

//we dont await this function so gameplay isnt interrupted
