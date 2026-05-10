export async function getSessionFeedback(subject: string, duration: number, notes: string, distractions: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch('/api/session-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subject,
        duration,
        notes,
        distractions
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { feedback?: string | null };
    return data.feedback ?? null;
  } catch (error) {
    console.error('Gemini error:', error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
