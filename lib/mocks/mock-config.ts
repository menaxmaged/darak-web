export const getMockMode = () => process.env.NEXT_PUBLIC_USE_MOCKS ?? '';

export const isMockEnabled = () => {
  const mode = getMockMode();
  return mode === 'true' || mode === 'fallback';
};

export const shouldForceMock = () => getMockMode() === 'true';

export const isFallbackMock = () => getMockMode() === 'fallback';

export const withMock = async <T>(fetcher: () => Promise<T>, mockValue: T): Promise<T> => {
  if (shouldForceMock()) {
    console.warn('Mock mode is enabled. Returning mock data:', mockValue);
    return mockValue;
  }
  try {
    return await fetcher();
  } catch (error) {
    if (getMockMode() === 'fallback') {
      console.warn('API request failed, falling back to mock data:', error);
      return mockValue;
    }
    throw error;
  }
};
