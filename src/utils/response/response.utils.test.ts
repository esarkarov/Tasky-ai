import { errorResponse, jsonResponse, successResponse } from '@/utils/response/response.utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.stubGlobal('Response', vi.fn());

const mockedResponse = vi.mocked(Response);

describe('response utils', () => {
  const JSON_HEADERS = { 'Content-Type': 'application/json' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const expectResponseCalledWith = (data: unknown, status: number) => {
    expect(mockedResponse).toHaveBeenCalledWith(JSON.stringify(data), {
      status,
      headers: JSON_HEADERS,
    });
  };

  describe('jsonResponse', () => {
    const mockResponses = [
      {
        description: 'object data',
        data: { message: 'test' },
        status: 200,
      },
      {
        description: 'array data',
        data: [1, 2, 3],
        status: 201,
      },
      {
        description: 'null data',
        data: null,
        status: 204,
      },
    ];

    it.each(mockResponses)('should create response with $description and status code', ({ data, status }) => {
      jsonResponse(data, status);

      expectResponseCalledWith(data, status);
    });
  });

  describe('errorResponse', () => {
    const mockHttpErrors = [
      { message: 'Not found', status: 404 },
      { message: 'Internal server error', status: 500 },
      { message: 'Bad request', status: 400 },
    ];

    it.each(mockHttpErrors)(
      'should create error response with message "$message" and status $status',
      ({ message, status }) => {
        const expectedData = { success: false, message };

        errorResponse(message, status);

        expectResponseCalledWith(expectedData, status);
      }
    );
  });

  describe('successResponse', () => {
    const DEFAULT_SUCCESS_STATUS = 200;

    describe('with message only', () => {
      it('should create response with default status', () => {
        const message = 'Operation successful';
        const expectedData = { success: true, message };

        successResponse(message);

        expectResponseCalledWith(expectedData, DEFAULT_SUCCESS_STATUS);
      });
    });

    describe('with message and data', () => {
      it('should merge data into response with default status', () => {
        const message = 'Success with data';
        const data = { id: 123, name: 'admin' };
        const expectedData = { success: true, message, ...data };

        successResponse(message, data);

        expectResponseCalledWith(expectedData, DEFAULT_SUCCESS_STATUS);
      });

      it('should merge data into response with custom status', () => {
        const message = 'Data retrieved';
        const data = { items: [1, 2, 3], total: 3 };
        const status = 201;
        const expectedData = { success: true, message, ...data };

        successResponse(message, data, status);

        expectResponseCalledWith(expectedData, status);
      });
    });
  });
});
