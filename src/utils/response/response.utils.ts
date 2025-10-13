export const jsonResponse = (data: unknown, status: number) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const errorResponse = (message: string, status: number) => {
  return jsonResponse({ success: false, message }, status);
};

export const successResponse = (message: string, data?: Record<string, unknown>, status: number = 200) => {
  return jsonResponse({ success: true, message, ...data }, status);
};
