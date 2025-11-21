export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      account_teams: {
        Row: {
          account_id: string
          id: string
          joined_at: string | null
          role: string
          team_id: string
        }
        Insert: {
          account_id: string
          id?: string
          joined_at?: string | null
          role?: string
          team_id: string
        }
        Update: {
          account_id?: string
          id?: string
          joined_at?: string | null
          role?: string
          team_id?: string
        }
      }
      accounts: {
        Row: {
          avatar_url: string | null
          bio: string | null
          bot_type: string | null
          created_at: string | null
          display_name: string
          email: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          organization_name: string | null
          organization_type: string | null
          owner_id: string | null
          type: string
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          bot_type?: string | null
          created_at?: string | null
          display_name: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          organization_name?: string | null
          organization_type?: string | null
          owner_id?: string | null
          type: string
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          bot_type?: string | null
          created_at?: string | null
          display_name?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          organization_name?: string | null
          organization_type?: string | null
          owner_id?: string | null
          type?: string
          updated_at?: string | null
          username?: string
        }
      }
      organization_members: {
        Row: {
          account_id: string
          id: string
          joined_at: string | null
          organization_id: string
          role: string
        }
        Insert: {
          account_id: string
          id?: string
          joined_at?: string | null
          organization_id: string
          role?: string
        }
        Update: {
          account_id?: string
          id?: string
          joined_at?: string | null
          organization_id?: string
          role?: string
        }
      }
      repositories: {
        Row: {
          created_at: string | null
          default_branch: string | null
          description: string | null
          id: string
          is_archived: boolean | null
          is_private: boolean | null
          metadata: Json | null
          name: string
          owner_id: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_branch?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          is_private?: boolean | null
          metadata?: Json | null
          name: string
          owner_id: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_branch?: string | null
          description?: string | null
          id?: string
          is_archived?: boolean | null
          is_private?: boolean | null
          metadata?: Json | null
          name?: string
          owner_id?: string
          slug?: string
          updated_at?: string | null
        }
      }
      repository_permissions: {
        Row: {
          account_id: string | null
          granted_at: string | null
          id: string
          permission: string
          repository_id: string
          team_id: string | null
        }
        Insert: {
          account_id?: string | null
          granted_at?: string | null
          id?: string
          permission: string
          repository_id: string
          team_id?: string | null
        }
        Update: {
          account_id?: string | null
          granted_at?: string | null
          id?: string
          permission?: string
          repository_id?: string
          team_id?: string | null
        }
      }
      teams: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          metadata: Json | null
          name: string
          organization_id: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          name: string
          organization_id: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          name?: string
          organization_id?: string
          slug?: string
          updated_at?: string | null
        }
      }
      work_items: {
        Row: {
          assignee_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          metadata: Json | null
          priority: string
          project_id: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          priority?: string
          project_id?: string | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assignee_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          priority?: string
          project_id?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
      }
    }
  }
}
