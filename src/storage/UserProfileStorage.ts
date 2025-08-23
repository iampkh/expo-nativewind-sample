import { DatabaseResult } from '../types/database.types';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export class UserProfileStorage {
  async query(sql: string, params?: any[]): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async createProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseResult<UserProfile>> {
    try {
      const id = Date.now().toString();
      const now = new Date().toISOString();
      const newProfile: UserProfile = {
        ...profile,
        id,
        createdAt: now,
        updatedAt: now,
      };

      await this.execute(
        'INSERT INTO user_profiles (id, name, email, avatar, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
        [newProfile.id, newProfile.name, newProfile.email, newProfile.avatar, newProfile.createdAt, newProfile.updatedAt]
      );

      return { success: true, data: newProfile };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getProfile(id: string): Promise<DatabaseResult<UserProfile>> {
    try {
      const results = await this.query('SELECT * FROM user_profiles WHERE id = ?', [id]);
      
      if (results.length === 0) {
        return { success: false, error: 'Profile not found' };
      }

      return { success: true, data: results[0] as UserProfile };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateProfile(id: string, updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>): Promise<DatabaseResult<UserProfile>> {
    try {
      const updatedAt = new Date().toISOString();
      const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(updates), updatedAt, id];

      await this.execute(
        `UPDATE user_profiles SET ${setClause}, updatedAt = ? WHERE id = ?`,
        values
      );

      const updatedProfile = await this.getProfile(id);
      return updatedProfile;
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async deleteProfile(id: string): Promise<DatabaseResult<boolean>> {
    try {
      await this.execute('DELETE FROM user_profiles WHERE id = ?', [id]);
      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getAllProfiles(): Promise<DatabaseResult<UserProfile[]>> {
    try {
      const results = await this.query('SELECT * FROM user_profiles ORDER BY createdAt DESC');
      return { success: true, data: results as UserProfile[] };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}