export function removeElement<T>(array: T[], element: T) {
  const index = array.findIndex((e) => e === element);
  if (index !== -1) array.splice(index, 1);
}

export function tickBouncer(
  threshold: number,
  callback: (time: number, ...args: any[]) => void,
) {
  let trace = 0;

  const tickBouncerCallback = (time: number, ...args: any[]) => {
    trace += time;

    if (trace > threshold) {
      trace = trace % threshold;
      callback(threshold, ...args);
    }
  };

  return tickBouncerCallback;
}

export function debounce(time: number, callback: (...args: any[]) => void) {
  let timeout: number | undefined;

  function debouncedCallback(...args: any[]) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      callback(...args);
    }, time);
  }

  return debouncedCallback;
}

export function checkCollision(
  x: number,
  y: number,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
  dx = 0,
  dy = 0,
): boolean {
  if (!(dx && dy)) {
    return minX <= x && x <= maxX && minY <= y && y <= maxY;
  }

  const x1 = x;
  const x2 = x + dx;
  const y1 = y;
  const y2 = y + dy;

  return (
    checkCollision(x1, y1, minX, minY, maxX, maxY) ||
    checkCollision(x1, y2, minX, minY, maxX, maxY) ||
    checkCollision(x2, y1, minX, minY, maxX, maxY) ||
    checkCollision(x2, y2, minX, minY, maxX, maxY)
  );
}
