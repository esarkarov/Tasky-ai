import { errorResponse, jsonResponse, successResponse } from '@/utils/response/response.utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.stubGlobal('Response', vi.fn());

describe('response utils', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('jsonResponse', () => {
    it('should create response with JSON data and status', () => {
      const data = { message: 'test' };
      const status = 200;

      jsonResponse(data, status);

      expect(Response).toHaveBeenCalledWith(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should handle different data types', () => {
      const data = [1, 2, 3];
      const status = 201;

      jsonResponse(data, status);

      expect(Response).toHaveBeenCalledWith(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should handle null data', () => {
      const data = null;
      const status = 204;

      jsonResponse(data, status);

      expect(Response).toHaveBeenCalledWith(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });

  describe('errorResponse', () => {
    it('should create error response with message and status', () => {
      const message = 'Not found';
      const status = 404;

      errorResponse(message, status);

      expect(Response).toHaveBeenCalledWith(JSON.stringify({ success: false, message }), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should handle different error status codes', () => {
      const message = 'Internal server error';
      const status = 500;

      errorResponse(message, status);

      expect(Response).toHaveBeenCalledWith(JSON.stringify({ success: false, message }), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });

  describe('successResponse', () => {
    it('should create success response with message and default status', () => {
      const message = 'Operation successful';

      successResponse(message);

      expect(Response).toHaveBeenCalledWith(JSON.stringify({ success: true, message }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should create success response with message, data, and custom status', () => {
      const message = 'Data retrieved';
      const data = { items: [1, 2, 3], total: 3 };
      const status = 201;

      successResponse(message, data, status);

      expect(Response).toHaveBeenCalledWith(JSON.stringify({ success: true, message, ...data }), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should create success response without additional data', () => {
      const message = 'Success without data';

      successResponse(message);

      expect(Response).toHaveBeenCalledWith(JSON.stringify({ success: true, message }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should merge data correctly when provided', () => {
      const message = 'Success with data';
      const data = { userId: 123, role: 'admin' };

      successResponse(message, data);

      expect(Response).toHaveBeenCalledWith(JSON.stringify({ success: true, message, userId: 123, role: 'admin' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });
});
