export const showNotification = (
  message: string, 
  type: "success" | "error" | "info" = "info"
) => {
  const event = new CustomEvent("show-notification", {
    detail: { message, type }
  });
  window.dispatchEvent(event);
};