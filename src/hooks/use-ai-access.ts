import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export interface AIAccessState {
  hasAccess: boolean;
  isAuthenticated: boolean;
  creditBalance: number;
  creditCost: number;
  userRole: string | null;
  requiresCredits: boolean;
}

async function fetchAIAccessState(generationId: number): Promise<AIAccessState> {
  const response = await fetch(`/api/credits/ai-access?generationId=${generationId}`);
  if (!response.ok) {
    throw new Error("Failed to check AI access");
  }
  return response.json();
}

async function consumeAICredits(generationId: number): Promise<{ success: boolean; newBalance: number }> {
  const response = await fetch("/api/credits/ai-consume", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ generationId }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to consume credits");
  }

  return response.json();
}

export function useAIAccess(generationId: number) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["aiAccess", generationId],
    queryFn: () => fetchAIAccessState(generationId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: generationId > 0,
    retry: false, // Don't retry on error to avoid blocking the UI
  });

  const consumeMutation = useMutation({
    mutationFn: () => consumeAICredits(generationId),
    onSuccess: () => {
      // Invalidate queries to refresh access state and credit balance
      queryClient.invalidateQueries({ queryKey: ["aiAccess", generationId] });
      queryClient.invalidateQueries({ queryKey: ["creditBalance"] });
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["aiAccess", generationId] });
    queryClient.invalidateQueries({ queryKey: ["creditBalance"] });
  };

  return {
    ...query,
    consume: consumeMutation.mutate,
    isConsuming: consumeMutation.isPending,
    consumeError: consumeMutation.error,
    invalidate,
  };
}
