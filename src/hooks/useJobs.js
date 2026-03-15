import { useContext } from 'react';

import { JobsContext } from '../context/JobsContext';

export function useJobs() {
    const jobsContext = useContext(JobsContext);

    if (!jobsContext) {
        throw new Error('useJobs must be used within a JobsProvider.');
    }

    return jobsContext;
}