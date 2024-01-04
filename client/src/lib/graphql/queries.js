import { ApolloClient, ApolloLink, InMemoryCache, concat, createHttpLink, gql } from "@apollo/client"
import { GraphQLClient } from 'graphql-request'
import { getAccessToken } from '../auth';

const client = new GraphQLClient("http://localhost:9000/graphql", {
  headers: () => {
    const accessToken = getAccessToken()
    if (accessToken) {
      return { 'Authorization': `Bearer ${accessToken}` }
    }
    return {}
  }
});
const httpLink = createHttpLink({ uri: "http://localhost:9000/graphql" });

const customLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken()
  if (accessToken) {
    // Context un objet ou on met les propriétés qui seront utilisés par notre requete
    operation.setContext({
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
  }
  return forward(operation)
})

export const apolloClient = new ApolloClient({
  link: concat(customLink, httpLink),
  cache: new InMemoryCache(),
  // defaultOptions:{
  //   query:{
  //     fetchPolicy:"network-only"
  //   }
  // }
})
const jobDetailFragment = gql`
  fragment JobDetail on Job{
      id
      date
      title
      company {
        id
        name 
      }
      description
  }
`
const jobByIdQuery = gql`
  query($id: ID!)   {
    job(id: $id){
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;
export const companyByIdQuery = gql`
query($id: ID!)   {
  company(id: $id){
    id
    name
    description
    jobs{
        id
        title
        date
    }
  }
}`;
export async function createJob({ title, description }) {
  const mutation = gql`
  mutation CreateJob($input: CreateJobInput!){
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
  `
  // const { job } = await client.request(mutation, {
  //   input: { title, description }
  // });
  const { data } = await apolloClient.mutate({
    mutation,
    variables: { input: { title, description } },
    update: (cache, { data }) => {
      cache.writeQuery({
        query: jobByIdQuery,
        variables: { id: data.job.id },
        data
      })
    }
  })
  return data.job;
}
export async function getJob(id) {
  // const { job } = await client.request(query, { id });
  // return job;
  const { data } = await apolloClient.query({ query: jobByIdQuery, variables: { id } })
  return data.job
}
// No Longer using this
// export async function getCompany(id) {
//   // const { company } = await client.request(query, { id });
//   // return company;
//   const { data } = await apolloClient.query({ query: companyByIdQuery, variables: { id } })
//   return data.company
// }
export async function getJobs() {
  const query = gql`
    query  Jobs{
        jobs{
          id
          date
          title
          company {
            id
            name 
          }
        }
      }`;

  // const { jobs } = await client.request(query);
  // return jobs;
  const { data } = await apolloClient.query({ query, fetchPolicy: "network-only" }) // return data - loading - networkStatus
  return data.jobs
}