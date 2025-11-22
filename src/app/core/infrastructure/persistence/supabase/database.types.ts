export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      account_teams: {
        Row: {
          account_id: string;
          id: string;
          joined_at: string | null;
          role: string;
          team_id: string;
        };
        Insert: {
          account_id: string;
          id?: string;
          joined_at?: string | null;
          role?: string;
          team_id: string;
        };
        Update: {
          account_id?: string;
          id?: string;
          joined_at?: string | null;
          role?: string;
          team_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'account_teams_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'account_teams_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
        ];
      };
      accounts: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          bot_type: string | null;
          created_at: string | null;
          display_name: string;
          email: string | null;
          id: string;
          is_active: boolean | null;
          metadata: Json | null;
          organization_name: string | null;
          organization_type: string | null;
          owner_id: string | null;
          type: string;
          updated_at: string | null;
          username: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          bot_type?: string | null;
          created_at?: string | null;
          display_name: string;
          email?: string | null;
          id?: string;
          is_active?: boolean | null;
          metadata?: Json | null;
          organization_name?: string | null;
          organization_type?: string | null;
          owner_id?: string | null;
          type: string;
          updated_at?: string | null;
          username: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          bot_type?: string | null;
          created_at?: string | null;
          display_name?: string;
          email?: string | null;
          id?: string;
          is_active?: boolean | null;
          metadata?: Json | null;
          organization_name?: string | null;
          organization_type?: string | null;
          owner_id?: string | null;
          type?: string;
          updated_at?: string | null;
          username?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'accounts_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
        ];
      };
      files: {
        Row: {
          created_at: string | null;
          id: string;
          metadata: Json | null;
          mime_type: string | null;
          name: string;
          path: string;
          size: number;
          storage_path: string;
          updated_at: string | null;
          uploaded_by: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          mime_type?: string | null;
          name: string;
          path: string;
          size: number;
          storage_path: string;
          updated_at?: string | null;
          uploaded_by: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          mime_type?: string | null;
          name?: string;
          path?: string;
          size?: number;
          storage_path?: string;
          updated_at?: string | null;
          uploaded_by?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'files_uploaded_by_fkey';
            columns: ['uploaded_by'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'files_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspaces';
            referencedColumns: ['id'];
          },
        ];
      };
      organization_members: {
        Row: {
          account_id: string;
          id: string;
          joined_at: string | null;
          organization_id: string;
          role: string;
        };
        Insert: {
          account_id: string;
          id?: string;
          joined_at?: string | null;
          organization_id: string;
          role?: string;
        };
        Update: {
          account_id?: string;
          id?: string;
          joined_at?: string | null;
          organization_id?: string;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'organization_members_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'organization_members_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
        ];
      };
      repositories: {
        Row: {
          created_at: string | null;
          default_branch: string | null;
          description: string | null;
          id: string;
          is_archived: boolean | null;
          is_private: boolean | null;
          metadata: Json | null;
          name: string;
          owner_id: string;
          slug: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          default_branch?: string | null;
          description?: string | null;
          id?: string;
          is_archived?: boolean | null;
          is_private?: boolean | null;
          metadata?: Json | null;
          name: string;
          owner_id: string;
          slug: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          default_branch?: string | null;
          description?: string | null;
          id?: string;
          is_archived?: boolean | null;
          is_private?: boolean | null;
          metadata?: Json | null;
          name?: string;
          owner_id?: string;
          slug?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'repositories_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
        ];
      };
      repository_permissions: {
        Row: {
          account_id: string | null;
          granted_at: string | null;
          id: string;
          permission: string;
          repository_id: string;
          team_id: string | null;
        };
        Insert: {
          account_id?: string | null;
          granted_at?: string | null;
          id?: string;
          permission: string;
          repository_id: string;
          team_id?: string | null;
        };
        Update: {
          account_id?: string | null;
          granted_at?: string | null;
          id?: string;
          permission?: string;
          repository_id?: string;
          team_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'repository_permissions_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'repository_permissions_repository_id_fkey';
            columns: ['repository_id'];
            isOneToOne: false;
            referencedRelation: 'repositories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'repository_permissions_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
        ];
      };
      task_attachments: {
        Row: {
          attached_by: string;
          created_at: string | null;
          file_id: string;
          id: string;
          task_id: string;
        };
        Insert: {
          attached_by: string;
          created_at?: string | null;
          file_id: string;
          id?: string;
          task_id: string;
        };
        Update: {
          attached_by?: string;
          created_at?: string | null;
          file_id?: string;
          id?: string;
          task_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'task_attachments_attached_by_fkey';
            columns: ['attached_by'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_attachments_file_id_fkey';
            columns: ['file_id'];
            isOneToOne: false;
            referencedRelation: 'files';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_attachments_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: 'tasks';
            referencedColumns: ['id'];
          },
        ];
      };
      task_comments: {
        Row: {
          author_id: string;
          content: string;
          created_at: string | null;
          id: string;
          metadata: Json | null;
          task_id: string;
          updated_at: string | null;
        };
        Insert: {
          author_id: string;
          content: string;
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          task_id: string;
          updated_at?: string | null;
        };
        Update: {
          author_id?: string;
          content?: string;
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          task_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'task_comments_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_comments_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: 'tasks';
            referencedColumns: ['id'];
          },
        ];
      };
      tasks: {
        Row: {
          assignee_id: string | null;
          created_at: string | null;
          created_by: string;
          description: string | null;
          due_date: string | null;
          id: string;
          metadata: Json | null;
          priority: string;
          status: string;
          title: string;
          updated_at: string | null;
          workspace_id: string;
        };
        Insert: {
          assignee_id?: string | null;
          created_at?: string | null;
          created_by: string;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          metadata?: Json | null;
          priority?: string;
          status?: string;
          title: string;
          updated_at?: string | null;
          workspace_id: string;
        };
        Update: {
          assignee_id?: string | null;
          created_at?: string | null;
          created_by?: string;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          metadata?: Json | null;
          priority?: string;
          status?: string;
          title?: string;
          updated_at?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tasks_assignee_id_fkey';
            columns: ['assignee_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tasks_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tasks_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspaces';
            referencedColumns: ['id'];
          },
        ];
      };
      teams: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          is_public: boolean | null;
          metadata: Json | null;
          name: string;
          organization_id: string;
          slug: string;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_public?: boolean | null;
          metadata?: Json | null;
          name: string;
          organization_id: string;
          slug: string;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_public?: boolean | null;
          metadata?: Json | null;
          name?: string;
          organization_id?: string;
          slug?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'teams_organization_id_fkey';
            columns: ['organization_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
        ];
      };
      work_items: {
        Row: {
          assignee_id: string | null;
          created_at: string | null;
          created_by: string | null;
          description: string | null;
          id: string;
          metadata: Json | null;
          priority: string;
          project_id: string | null;
          status: string;
          tags: string[] | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          assignee_id?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          metadata?: Json | null;
          priority?: string;
          project_id?: string | null;
          status?: string;
          tags?: string[] | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          assignee_id?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          metadata?: Json | null;
          priority?: string;
          project_id?: string | null;
          status?: string;
          tags?: string[] | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      workspace_members: {
        Row: {
          account_id: string;
          id: string;
          joined_at: string | null;
          permissions: Json | null;
          role: string;
          workspace_id: string;
        };
        Insert: {
          account_id: string;
          id?: string;
          joined_at?: string | null;
          permissions?: Json | null;
          role?: string;
          workspace_id: string;
        };
        Update: {
          account_id?: string;
          id?: string;
          joined_at?: string | null;
          permissions?: Json | null;
          role?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'workspace_members_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'workspace_members_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspaces';
            referencedColumns: ['id'];
          },
        ];
      };
      workspace_resources: {
        Row: {
          created_at: string | null;
          id: string;
          metadata: Json | null;
          resource_id: string;
          resource_type: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          resource_id: string;
          resource_type: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          resource_id?: string;
          resource_type?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'workspace_resources_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspaces';
            referencedColumns: ['id'];
          },
        ];
      };
      workspaces: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          is_active: boolean | null;
          metadata: Json | null;
          name: string;
          owner_id: string;
          settings: Json | null;
          slug: string;
          type: string;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          metadata?: Json | null;
          name: string;
          owner_id: string;
          settings?: Json | null;
          slug: string;
          type: string;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          metadata?: Json | null;
          name?: string;
          owner_id?: string;
          settings?: Json | null;
          slug?: string;
          type?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'workspaces_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      count_user_workspaces: { Args: { user_uuid: string }; Returns: number };
      get_workspace_role: {
        Args: { user_uuid: string; workspace_uuid: string };
        Returns: string;
      };
      is_workspace_member: {
        Args: { user_uuid: string; workspace_uuid: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
