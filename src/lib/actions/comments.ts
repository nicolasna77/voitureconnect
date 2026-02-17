import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const commentApi = {
  getComments: async ({
    generationId,
    page = 1,
  }: {
    generationId: number;
    page?: number;
  }) => {
    const { data } = await api.get(
      `/comments?generationId=${generationId}&page=${page}`
    );
    return data;
  },

  createComment: async ({
    generationId,
    content,
    parentId,
  }: {
    generationId: number;
    content: string;
    parentId?: string;
  }) => {
    const { data } = await api.post("/comments", {
      generationId,
      content,
      parentId,
    });
    return data;
  },

  updateComment: async ({
    commentId,
    content,
  }: {
    commentId: string;
    content: string;
  }) => {
    const { data } = await api.patch(`/comments/${commentId}`, { content });
    return data;
  },

  deleteComment: async (commentId: string) => {
    const { data } = await api.delete(`/comments/${commentId}`);
    return data;
  },

  reportComment: async ({
    commentId,
    reason,
  }: {
    commentId: string;
    reason: string;
  }) => {
    const { data } = await api.post(`/comments/${commentId}/report`, {
      reason,
    });
    return data;
  },
};
