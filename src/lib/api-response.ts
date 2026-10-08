import { NextResponse } from 'next/server';

export function jsonResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status: number = 400, details?: any) {
  return NextResponse.json(
    {
      error: message,
      status,
      details: details || null,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
