import { useEffect, useState } from 'react';
import JobList from '../components/JobList';
// import { jobs } from '../lib/fake-data';
import { getJobs } from '../lib/graphql/queries';

function HomePage() {
  const [jobs, setJobs] = useState([])
  const getAllCompanies = () => {
    getJobs().then((data) => setJobs(data))
  }
  useEffect(() => {
    getAllCompanies()
  }, [])

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
