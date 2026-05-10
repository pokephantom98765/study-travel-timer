export class NotificationService {
  static async requestPermission() {
    if (!("Notification" in window)) {
      console.warn("This browser does not support desktop notification");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }

  static notify(title: string, options?: NotificationOptions) {
    if (Notification.permission === "granted") {
      return new Notification(title, {
        icon: '/favicon.ico', // Fallback icon
        ...options
      });
    }
  }

  static notifyArrival(from: string, to: string) {
    this.notify(`Touchdown in ${to}!`, {
      body: `Your journey from ${from} is complete. Your focus stats are ready.`,
      tag: 'journey-end'
    });
  }

  static notifyHalfway(to: string) {
    this.notify(`Halfway to ${to}!`, {
      body: `Keep it up, you're doing great.`,
      tag: 'journey-mid'
    });
  }
}
