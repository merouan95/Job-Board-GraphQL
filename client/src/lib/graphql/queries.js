import { ApolloClient, ApolloLink, InMemoryCache, concat, createHttpLink, gql } from "@apollo/client"
import { getAccessToken } from '../auth';

const httpLink = createHttpLink({ uri: "http://localhost:9000/graphql" });

const customLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken()
  if (accessToken) {
    // Context un objet ou on met les propriétés qui seront utilisés par notre requete
    operation.setContext({
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
  }
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: concat(customLink, httpLink),
  cache: new InMemoryCache(),
  // defaultOptions:{
  //   query:{
  //     fetchPolicy:"network-only"
  //   }
  // }
});

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
export const jobByIdQuery = gql`
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

export const jobsQuery = gql`
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

export const createJobMutation = gql`
mutation CreateJob($input: CreateJobInput!){
  job: createJob(input: $input) {
    ...JobDetail
  }
}
${jobDetailFragment}
`