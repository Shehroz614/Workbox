import { useMutation, useQuery } from "@tanstack/react-query";
import { apiUrls } from "../constants";
import { getRequest, postRequest, deleteRequest } from "../helpers/index";

export const ProjectService = {
  getProjects: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getProjects);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  getProjectsDetails: (key, id, options) => {
    return useQuery(
      [key, id],
      () => {
        return getRequest(apiUrls.getProjectsDetails(id));
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  createProject: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.createProject, payload);
    }, options);
  },
  updateProject: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.createProject, payload);
    }, options);
  },
  deleteProject: (options) => {
    return useMutation((payload) => {
      return deleteRequest(apiUrls.deleteProject(payload?.id));
    }, options);
  },
  delete: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.deleteProject, payload);
    }, options);
  },

  getComments: (key, projectId, options) => {
    return useQuery(
      [key, projectId],
      () => {
        return getRequest(apiUrls.getComments(projectId));
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  createComment: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.createComment, payload);
    }, options);
  },
  updateComment: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.updateComment, payload);
    }, options);
  },
  createCommentReaction: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.createCommentReaction, payload);
    }, options);
  },
  updateCommentReaction: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.updateCommentReaction, payload);
    }, options);
  },
  deleteCommentReaction: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.deleteCommentReaction, payload);
    }, options);
  },
  getEmployees: (key, options) => {
    return useQuery(
      [key],
      () => {
        return getRequest(apiUrls.getEmployees);
      },
      {
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
      }
    );
  },
  createIssue: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.createIssue, payload);
    }, options);
  },
  updateIssue: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.updateIssue, payload);
    }, options);
  },
  deleteIssue: (options) => {
    return useMutation((payload) => {
      return postRequest(apiUrls.deleteIssue, payload);
    }, options);
  },
  
};
