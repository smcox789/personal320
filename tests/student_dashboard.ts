import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient, useQuery } from 'react-query';
import StudentDashboard from '@/pages/studentdashboard';
import { API } from '@/lib/api';

jest.mock('@/lib/api', () => ({
  API: {
    getManagerPool: jest.fn(),
    getProfile: jest.fn(),
    getAllStudentApplications: jest.fn(),
  },       
}));

describe('StudentDashboard', () => {
  let queryClient: QueryClient;

  beforeAll(() => {
    queryClient = new QueryClient();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the student dashboard correctly', async () => {
    // Mock API responses
    API.getManagerPool.mockResolvedValueOnce(/* must still add classes response */);
    API.getProfile.mockResolvedValueOnce(/* must still add response */);
    API.getAllStudentApplications.mockResolvedValueOnce(/* must still add applications response */);

    render(
      <typeof QueryClientProvider client={queryClient}>
        <StudentDashboard />
      </QueryClientProvider>
    );

    // Assert that loading text is shown initially
    expect(screen.getByText('Loading')).toBeInTheDocument();

    // Wait for the data to be loaded and rendered
    await waitFor(() => screen.getByText('Sections'));

    // Assert that the loading text is no longer present
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();

    // Assert the rendered content based on the mocked responses
    expect(screen.getByText('Student Name')).toBeInTheDocument();

  });
});

