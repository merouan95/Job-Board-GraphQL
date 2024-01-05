import { companyLoader, getCompany } from "./db/companies.js";
import { createJob, deleteJob, getJob, getJobs, getJobsByCompany, updateJob } from "./db/jobs.js";
import { GraphQLError } from 'graphql';


export const resolvers = {
    Query: {
        jobs: () => getJobs(),
        job: async (_root, { id }) => {
            const job = await getJob(id);
            if (!job) {
                throw notFoundError("No Job found with this id: " + id)
            }
            return job;
        },
        company: async (_root, { id }) => {
            const company = await getCompany(id);
            if (!company) {
                throw notFoundError("No Company found with this id: " + id)
            }
            return company
        }
    },
    Mutation: {
        createJob: (_root, { input: { title, description } }, { user }) => {
            if (!user) {
                throw noAuthorizedError("Missing Authentication")
            }
            const companyId = user.companyId; // Based on authentification
            return createJob({ companyId, title, description })
        },
        deleteJob: async (_root, { id }, { user }) => {
            if (!user) {
                throw noAuthorizedError("Missing Authentication")
            }
            const job = await deleteJob(id, user.companyId)
            if (!job) {
                throw notFoundError("No Job found with this id: " + id)
            }
            return job;
        },
        updateJob: async (_root, { input: { id, title, description } }, { user }) => {
            if (!user) {
                throw noAuthorizedError("Missing Authentication")
            }
            const job = await updateJob({ id, title, description, companyId: user.companyId })
            if (!job) {
                throw notFoundError("No Job found with this id: " + id)
            }
            return job
        }
    },
    Job: {
        date: (job) => toIsoDate(job.createdAt),
        company: (job) => companyLoader.load(job.companyId)
    },
    Company: {
        jobs: (company) => getJobsByCompany(company.id)
    }
}
function toIsoDate(value) {
    return value.slice(0, 'yyyy-mm-dd'.length)
}
function notFoundError(message) {
    return new GraphQLError(message, {
        extensions: { code: 'NOT_FOUND' },
    });
}
function noAuthorizedError(message) {
    return new GraphQLError(message, {
        extensions: { code: 'UNAUTHORIZED' },
    });
}