import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, DataEntry as BackendDataEntry, Field, FieldType } from '../backend';

// Frontend-compatible DataEntry type with number timestamps
export interface FrontendDataEntry {
  id: string;
  title: string;
  category: string;
  createdAt: number;
  updatedAt: number;
  fields: Array<{
    name: string;
    type: 'text' | 'password' | 'otp' | 'url' | 'email' | 'date';
    value: string;
  }>;
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Real implementation for canister management using backend methods
export function useGetCanisterStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ status: 'not_deployed' | 'deploying' | 'deployed' | 'failed'; canisterId?: string }>({
    queryKey: ['canisterStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const hasDeployed = await actor.hasDeployedPersonalCanister();
      return { 
        status: hasDeployed ? 'deployed' as const : 'not_deployed' as const 
      };
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useDeployPersonalCanister() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.deployPersonalCanister();
    },
    onSuccess: () => {
      // Invalidate canister status to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['canisterStatus'] });
    },
    onError: (error: any) => {
      // Log the error for debugging
      console.error('Personal canister deployment failed:', error);
      // Invalidate canister status to refresh the UI even on error
      queryClient.invalidateQueries({ queryKey: ['canisterStatus'] });
    },
  });
}

// Real implementation for data entry management
export function useGetDataEntries() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: canisterStatus } = useGetCanisterStatus();

  return useQuery<FrontendDataEntry[]>({
    queryKey: ['dataEntries'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const entries = await actor.getDataEntries();
      // Convert backend entries to frontend-compatible format
      return entries.map((entry: BackendDataEntry): FrontendDataEntry => ({
        id: entry.id,
        title: entry.title,
        category: entry.category,
        // Convert nanoseconds to milliseconds for JavaScript Date compatibility
        createdAt: Number(entry.createdAt) / 1_000_000,
        updatedAt: Number(entry.updatedAt) / 1_000_000,
        fields: entry.fields.map(field => ({
          name: field.name,
          value: field.value,
          type: field.fieldType as 'text' | 'password' | 'otp' | 'url' | 'email' | 'date',
        })),
      }));
    },
    enabled: !!actor && !actorFetching && canisterStatus?.status === 'deployed',
  });
}

export function useCreateDataEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: {
      title: string;
      category: string;
      fields: Array<{
        name: string;
        type: 'text' | 'password' | 'otp' | 'url' | 'email' | 'date';
        value: string;
      }>;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Convert frontend field types to backend FieldType enum
      const backendFields: Field[] = entry.fields.map(field => ({
        name: field.name,
        value: field.value,
        fieldType: field.type as FieldType,
      }));

      return actor.createDataEntry(entry.title, entry.category, backendFields);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataEntries'] });
    },
    onError: (error: any) => {
      console.error('Failed to create data entry:', error);
      throw error;
    },
  });
}

export function useUpdateDataEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: {
      id: string;
      title: string;
      category: string;
      fields: Array<{
        name: string;
        type: 'text' | 'password' | 'otp' | 'url' | 'email' | 'date';
        value: string;
      }>;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Convert frontend field types to backend FieldType enum
      const backendFields: Field[] = entry.fields.map(field => ({
        name: field.name,
        value: field.value,
        fieldType: field.type as FieldType,
      }));

      return actor.updateDataEntry(entry.id, entry.title, entry.category, backendFields);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataEntries'] });
    },
    onError: (error: any) => {
      console.error('Failed to update data entry:', error);
      throw error;
    },
  });
}

export function useDeleteDataEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteDataEntry(entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataEntries'] });
    },
    onError: (error: any) => {
      console.error('Failed to delete data entry:', error);
      throw error;
    },
  });
}

// TOTP generation - client-side implementation since backend cannot access external APIs
export function useGenerateTOTP() {
  return useMutation({
    mutationFn: async (secret: string): Promise<{ code: string; timeLeft: number }> => {
      // Simple TOTP implementation for demo purposes
      // In a real application, you would use a proper TOTP library like 'otplib'
      const epoch = Math.floor(Date.now() / 1000);
      const timeStep = 30;
      const counter = Math.floor(epoch / timeStep);
      const timeLeft = timeStep - (epoch % timeStep);
      
      // Generate a pseudo-random 6-digit code based on secret and counter
      // This is a simplified implementation for demo purposes
      const hash = await crypto.subtle.digest('SHA-256', 
        new TextEncoder().encode(secret + counter.toString())
      );
      const hashArray = new Uint8Array(hash);
      const code = (hashArray[0] * 1000000 + hashArray[1] * 10000 + hashArray[2] * 100 + hashArray[3]) % 1000000;
      
      return {
        code: code.toString().padStart(6, '0'),
        timeLeft,
      };
    },
  });
}
