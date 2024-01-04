import { useParams } from 'react-router';
import { companyByIdQuery, getCompany } from '../lib/graphql/queries';
import { useEffect, useState } from 'react';
import JobList from '../components/JobList';
import { useQuery } from '@apollo/client';

function CompanyPage() {
  const { companyId } = useParams();
  const { data, loading, error } = useQuery(companyByIdQuery, {
    variables: {
      id: companyId
    }
  })
  // Replaced code with only useQuery above
  // const [company, setCompany] = useState(null)
  // const getCompanyFunc = () => {
  //   getCompany(companyId).then((data) => setCompany(data)).catch(err=>console.log("error",err))
  // }
  // useEffect(() => {
  //   getCompanyFunc()
  // }, [])
  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Data unailable...</div>
  }
  const { company } = data;
  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <h2 className='title is-5'>
        Jobs at {company.name}
      </h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
