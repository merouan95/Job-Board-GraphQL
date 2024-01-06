import { useState } from 'react';
import JobList from '../components/JobList';
import { useJobs } from '../lib/graphql/hooks';

const JOBS_PER_PAGE = 20;

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const { jobs, loading, error } = useJobs(JOBS_PER_PAGE, (currentPage - 1) * JOBS_PER_PAGE)
  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Loading unvailable...</div>
  }
  const totalPages = Math.ceil(jobs.totalCount / JOBS_PER_PAGE)
  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <div>
        <button onClick={() => setCurrentPage((value) => value - 1)} disabled={currentPage === 1}>Previous</button>
        <span>{`${currentPage} of ${totalPages}`}</span>
        <button onClick={() => setCurrentPage((value) => value + 1)} disabled={currentPage === totalPages}>Next</button>
      </div>
      <JobList jobs={jobs.items} />
    </div>
  );
}

export default HomePage;
